// Fig 1 live code. The page inlines the kit, lathe (as G), model.mjs and this file,
// then calls mount(figure). Every value drawn or printed comes from the model.
const DATA = __DATA__;

function mount(fig) {
  const P = DATA.P;
  const stage = fig.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const q = (sel) => svg.querySelector(sel);
  const movers = (piece) => [...svg.querySelectorAll(`[data-move="${piece}"]`)];
  const rodItems = movers("rod");
  const jawU = movers("jawU");
  const jawL = movers("jawL");
  const thread = q('[data-part="thread"]');
  const pointer = q('[data-part="pointer"]');
  const needles = { skin: q('[data-part="needle-skin"]'), hr: q('[data-part="needle-hr"]') };
  const slats = [...svg.querySelectorAll("[data-slat]")];
  const bar = q('[data-part="bar"]');
  const crankpins = q('[data-part="crankpins"]');
  const wash = q('[data-part="wash"]');
  const lamps = { warm: q('[data-lamp="warm"]'), cool: q('[data-lamp="cool"]') };
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((node) => [node.dataset.r, node]));
  const status = fig.querySelector("[data-status]");
  const buttons = [...fig.querySelectorAll('[data-control="stage"] .opt-seg-btn')];
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  const zOf = (t) => DATA.ZREF + t * DATA.KZ;
  const SPEED = 1; // model minutes per real second
  const QUIET = 4; // minutes between the end of one event and the next rise (the cut quiet time)
  const CHILL_END = TRUTH.chillMin[2];

  // ---------------------------------------------------------------- drawing helpers (same maths as the build)
  const screwRings = (offset, from, to, dir) => {
    const [x, y] = DATA.screw;
    const pitch = 3;
    const rings = [];
    const start = (((offset % pitch) + pitch) % pitch);
    if (dir > 0) for (let z = from + start; z < to; z += pitch) rings.push(sideArc(x, y, 2.2, z, P, 12));
    else for (let z = to - start; z > from; z -= pitch) rings.push(sideArc(x, y, 2.2, z, P, 12));
    return rings.join("");
  };
  const pointerAt = (angle) => {
    const { x, y, r, top } = DATA.knob;
    return lineOnTop([x - Math.sin(angle) * 2, y + Math.cos(angle) * 2], [x + Math.sin(angle) * (r - 1.2), y - Math.cos(angle) * (r - 1.2)], top, P);
  };
  const needleAt = (name, angle) => {
    const [x, y] = DATA.dials[name];
    const R = DATA.dialR;
    return lineOnTop([x - Math.sin(angle) * 2.6, y + Math.cos(angle) * 2.6], [x + Math.sin(angle) * (R - 3.4), y - Math.cos(angle) * (R - 3.4)], DATA.dialZ + 0.2, P);
  };
  const slatSvg = (zc, deg) => {
    const a = (deg * Math.PI) / 180;
    const F = G.frameOf([DATA.slat.x, DATA.slat.y, zc], [1, 0, 0], [0, Math.sin(a), Math.cos(a)], [0, -Math.cos(a), Math.sin(a)]);
    return solidSvg(G.prismOf(F, DATA.slat.poly, 0, DATA.slat.len, P), { tone: "hi", crease: "lo" });
  };
  const crankTip = (zc, deg) => {
    const a = (deg * Math.PI) / 180;
    return DATA.bar.pivotY - DATA.bar.crank * Math.cos(a);
  };
  const move = (nodes, dz) => {
    const t = translateAlong(P, [0, 0, dz]);
    const [dx, dy] = axisVector(P, [0, 0, dz]);
    for (const node of nodes) {
      if (dz) node.setAttribute("transform", t);
      else node.removeAttribute("transform");
      if (node.querySelector("[data-hold]")) holdStill(node, [dx, dy]);
    }
  };

  // ---------------------------------------------------------------- state (model minutes)
  const knob = { x: 1, v: 0 };
  let eTarget = 1;
  let clock = 0;
  let swingStart = -1e9;
  let flashStart = -1e9;
  let flashFrom = 0;
  let nextSwing = 1;
  let touring = !still.matches;
  let tourClock = 0;
  let fired = new Set();
  let visible = false;
  let frame = 0;
  let last = 0;
  let idleTimer = 0;
  let phase = "";
  const drawn = {};

  // The idle tour: a rise with the zone wide (nothing happens), the knob turns to
  // post-menopause, the same rise trips a flash and the after-chill, the knob turns back.
  const TOUR = { length: 54, events: [[1, "swing"], [19, "post"], [23, "swing"], [46, "pre"]] };

  const coreAt = (t) => {
    const ft = t - flashStart;
    if (ft >= 0 && ft < CHILL_END) return flashFrom * (1 - smooth(0, 1.5, ft)) + flashAt(ft).chill;
    return swingAt(t - swingStart);
  };

  function startSwing() {
    const ft = clock - flashStart;
    const swingOn = clock - swingStart < 2 * TRUTH.swingRiseMin;
    if (swingOn || (ft >= 0 && ft < CHILL_END)) return false;
    swingStart = clock;
    return true;
  }

  function step(dt) {
    const calm = still.matches;
    clock += dt * SPEED;
    if (touring) {
      const before = tourClock;
      tourClock += dt * SPEED;
      if (tourClock >= TOUR.length) {
        tourClock -= TOUR.length;
        fired = new Set();
      }
      for (const [at, what] of TOUR.events) {
        if (!fired.has(at) && tourClock >= at && (before < at || before > tourClock)) {
          fired.add(at);
          if (what === "swing") startSwing();
          else setTarget(what === "post" ? 0 : 1, false);
        }
      }
    } else if (!calm && clock >= nextSwing && startSwing()) {
      nextSwing = clock + 2 * TRUTH.swingRiseMin + QUIET;
    }
    settleKnob(dt, calm);
    const zone = zoneOf(knob.x);
    const core = coreAt(clock);
    const ft = clock - flashStart;
    if (!(ft >= 0 && ft < CHILL_END) && core >= zone.sweat - 1e-4) {
      flashStart = clock;
      flashFrom = zone.sweat;
      swingStart = -1e9;
      nextSwing = clock + CHILL_END + QUIET;
    }
  }

  function settleKnob(dt, calm) {
    if (calm) {
      knob.x = eTarget;
      knob.v = 0;
      return;
    }
    const w = 1 / 0.45;
    for (let i = 0; i < 4; i++) {
      const h = dt / 4;
      knob.v += (w * w * (eTarget - knob.x) - 2 * w * knob.v) * h;
      knob.x += knob.v * h;
    }
    if (Math.abs(eTarget - knob.x) < 1e-4 && Math.abs(knob.v) < 1e-4) {
      knob.x = eTarget;
      knob.v = 0;
    }
  }

  // ---------------------------------------------------------------- draw
  function draw() {
    const e = knob.x;
    const zone = zoneOf(e);
    const core = coreAt(clock);
    const shown = clamp(core, zone.shiver, zone.sweat);
    const ft = clock - flashStart;
    const flash = ft >= 0 && ft < 90 ? flashAt(ft) : flashAt(-1);
    const chilled = ft >= 0 && ft < CHILL_END && core <= zone.shiver + 1e-4;

    const set = (key, value, fn) => {
      if (drawn[key] !== value) {
        drawn[key] = value;
        fn(value);
      }
    };
    const zf = zOf(shown);
    set("rod", Math.round(zf * 100) / 100, (z) => move(rodItems, z - DATA.rod0));
    const du = zOf(zone.sweat) - DATA.zone0.sweat;
    const dl = zOf(zone.shiver) - DATA.zone0.shiver;
    set("jawU", Math.round(du * 100) / 100, (v) => move(jawU, v));
    set("jawL", Math.round(dl * 100) / 100, (v) => move(jawL, v));
    set("thread", Math.round(du * 50) / 50, () => {
      const lower = screwRings(dl, DATA.screwZ[0], DATA.screwMid - 1, 1);
      const upper = screwRings(-du, DATA.screwMid + 1, DATA.screwZ[1], -1);
      thread.setAttribute("d", lower + upper);
    });
    set("pointer", Math.round(e * 2000), () => pointer.setAttribute("d", pointerAt(knobAngle(e))));
    const deg = DATA.slatOpen * flash.louvre;
    set("slats", Math.round(deg * 4) / 4, (d) => {
      slats.forEach((node, i) => (node.innerHTML = slatSvg(DATA.slats[i], d)));
      const lift = DATA.bar.crank * Math.sin((d * Math.PI) / 180);
      move([bar], lift);
      crankpins.innerHTML = dotsSvg(DATA.slats.map((zc) => at3([DATA.bar.x, crankTip(zc, d), zc])), { size: 0.8, tone: "hi" });
      wash.style.opacity = String(flash.louvre);
    });
    set("skin", Math.round(flash.skin * 100), () => needles.skin.setAttribute("d", needleAt("skin", DIALS.skin.angleOf(flash.skin))));
    set("hr", Math.round(flash.hr * 10), () => needles.hr.setAttribute("d", needleAt("hr", DIALS.hr.angleOf(flash.hr))));
    set("warm", flash.on > 0.25, (on) => (on ? lamps.warm.setAttribute("data-on", "") : lamps.warm.removeAttribute("data-on")));
    set("cool", chilled, (on) => (on ? lamps.cool.setAttribute("data-on", "") : lamps.cool.removeAttribute("data-on")));

    const sign = (v, digits) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(digits);
    const rate = rateOf(e);
    set("out.core", sign(Math.abs(shown) < 0.005 ? 0 : shown, 2) + " °C", (t) => (out.core.textContent = t));
    set("out.zone", zone.shown.toFixed(1) + " °C", (t) => (out.zone.textContent = t));
    set("out.rate", (rate < 0.05 ? "0" : rate.toFixed(1)) + " / h", (t) => (out.rate.textContent = t));
    set("out.skin", sign(flash.skin, 1) + " °C", (t) => (out.skin.textContent = t));

    const now = flash.on > 0.25 ? "Hot flash: skin vessels open, heart rate up" : chilled ? "After-chill: core dips below the zone" : "";
    if (now !== phase) {
      phase = now;
      if (now && document.activeElement === stage) status.textContent = now;
    }
    stage.setAttribute("data-flash", flash.on > 0.25 ? "on" : "off");
  }
  const at3 = (p) => iso(p, P);

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    step(dt);
    draw();
    frame = visible ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (!frame && visible && !still.matches) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  // ---------------------------------------------------------------- input
  const describe = () => {
    const e = eTarget;
    const zone = zoneOf(e);
    const rate = rateOf(e);
    const name = e >= 0.999 ? "Pre-menopause" : e <= 0.001 ? "Post-menopause, with hot flashes" : `Estrogen ${Math.round(e * 100)} %`;
    stage.setAttribute("aria-valuenow", String(Math.round(e * 100)));
    stage.setAttribute("aria-valuetext", `${name}: zone ${zone.shown.toFixed(1)} °C, ${rate < 0.05 ? "no hot flashes" : `about ${rate.toFixed(1)} hot flashes an hour`}`);
    buttons.forEach((b) => {
      const on = Number(b.dataset.value) === e;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on || (!buttons.some((x) => Number(x.dataset.value) === e) && b === buttons[0]) ? 0 : -1;
    });
  };
  function setTarget(e, byHand = true) {
    eTarget = clamp(e, 0, 1);
    describe();
    if (byHand) takeOver();
    if (still.matches) stillFrame();
    run();
  }
  function takeOver() {
    touring = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (still.matches) return;
      touring = true;
      tourClock = 0;
      fired = new Set();
      run();
    }, 3600);
  }
  // Reduced motion: one still frame that still explains the idea. At the post end it
  // shows a flash at its height (finger on the upper jaw, louvres open, dials up).
  function stillFrame() {
    knob.x = eTarget;
    knob.v = 0;
    clock = 1000;
    swingStart = -1e9;
    if (eTarget < 0.5) {
      flashStart = clock - 1.4;
      flashFrom = zoneOf(eTarget).sweat;
    } else flashStart = -1e9;
    draw();
  }

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      setTarget(Number(button.dataset.value));
      if (!still.matches && Number(button.dataset.value) === 0) nextSwing = Math.min(nextSwing, clock + 1.5);
    }),
  );
  fig.querySelector('[data-control="stage"]')?.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(document.activeElement) >= 0 ? buttons.indexOf(document.activeElement) : buttons.indexOf(fig.ownerDocument?.activeElement);
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(buttons.length - 1, index + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, index - 1);
    if (next === null || index < 0) return;
    event.preventDefault();
    buttons[next].focus();
    buttons[next].click();
  });
  stage.addEventListener("keydown", (event) => {
    const stepBy = event.shiftKey ? 0.25 : 0.1;
    let to = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") to = eTarget - stepBy;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") to = eTarget + stepBy;
    if (event.key === "Home") to = 1;
    if (event.key === "End") to = 0;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      takeOver();
      if (!still.matches) startSwing();
      run();
      return;
    }
    if (to === null) return;
    event.preventDefault();
    if (touring) eTarget = knob.x;
    setTarget(Math.round(clamp(to, 0, 1) * 100) / 100);
  });
  let drag = null;
  stage.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, e: eTarget, id: event.pointerId, live: false };
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.live && Math.abs(dx) > 6) {
      drag.live = true;
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {}
    }
    if (drag.live) setTarget(clamp(drag.e - dx / (stage.clientWidth * 0.55), 0, 1));
  });
  const endDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.live) {
      takeOver();
      if (!still.matches) startSwing();
      run();
    }
    drag = null;
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", () => (drag = null));
  stage.addEventListener("focus", () => (status.textContent = stage.getAttribute("aria-valuetext")));
  still.addEventListener?.("change", () => {
    touring = !still.matches;
    if (still.matches) stillFrame();
    else run();
  });

  new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  ).observe(stage);

  describe();
  if (still.matches) {
    setTarget(0, false);
    stillFrame();
  } else draw();
}
