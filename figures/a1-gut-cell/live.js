// A1 live code: iron in through DMT1, out through ferroportin; hepcidin docks and the cell pulls gates in.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const sceneLine = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="scene"] .opt-seg-btn')];
  const N = { fpn: q('[data-part="fpn"]'), ves: q('[data-part="vesicles"]'), blood: q('[data-part="blood"]'), iron: q('[data-part="iron"]'), hep: q('[data-part="hep"]'), cores: DATA.FERRITIN.map((_, i) => q(`[data-part="core${i}"]`)) };
  const { APICAL, BASAL, CAP, DMT1, FERRITIN } = DATA;
  const f1 = (v) => v.toFixed(1);
  const pill = (x, y, w, h) => `M${f1(x + w / 2)} ${f1(y)}a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${w / 2}v${f1(h - w)}a${w / 2} ${w / 2} 0 0 1 ${-w} 0v${f1(-(h - w))}a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-w / 2}Z`;
  const hepPath = (x, y) => `M${f1(x - 5)} ${f1(y - 4)}c0 7 10 7 10 0c0 -4 -3 -5 -3 -2c0 3 -4 3 -4 0c0 -3 -3 -2 -3 2Z`;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // ---------------------------------------------------------------- state
  let sceneAt = 0;
  let gate = DATA.scenes[0].gate;
  let target = activeOf(gate);
  const ORDER = [0, 4, 1, 3, 2]; // gates close from the ends inward
  const slots = DATA.FPN.map((x) => ({ x, state: "on", t: 0 }));
  ORDER.slice(target).forEach((i) => (slots[i].state = "gone"));
  const irons = [];
  const heps = [];
  const fill = [3, 2, 3];
  const tf = Array.from({ length: 3 }, (_, i) => ({ x: i * 210 + 40, load: 0 }));
  const rbc = Array.from({ length: 6 }, (_, i) => ({ x: i * 110 + 20, y: rnd(CAP.y0 + 16, CAP.y1 - 16) }));
  let spawn = 0;

  const working = () => slots.filter((s) => s.state === "on");
  function moveTo(p, tx, ty, speed, dt) {
    const dx = tx - p.x;
    const dy = ty - p.y;
    const d = Math.hypot(dx, dy);
    if (d <= speed * dt) {
      p.x = tx;
      p.y = ty;
      return true;
    }
    p.x += (dx / d) * speed * dt;
    p.y += (dy / d) * speed * dt;
    return false;
  }

  // ---------------------------------------------------------------- one step
  function step(dt) {
    // iron arrives in the lumen and heads for a DMT1 channel
    spawn += dt * 1.7;
    while (spawn > 1) {
      spawn -= 1;
      const d = DMT1[Math.floor(Math.random() * DMT1.length)];
      irons.push({ x: rnd(170, 430), y: rnd(14, 60), stage: "lumen", d, wob: rnd(0, 6) });
    }
    for (let i = irons.length - 1; i >= 0; i--) {
      const p = irons[i];
      if (p.stage === "lumen" && moveTo(p, p.d[0], p.d[1] - 8, 55, dt)) p.stage = "in";
      else if (p.stage === "in" && moveTo(p, p.d[0], APICAL + 26, 45, dt)) {
        p.stage = "cyto";
        p.tx = rnd(185, 415);
        p.ty = rnd(210, 380);
      } else if (p.stage === "cyto" && moveTo(p, p.tx, p.ty, 40, dt)) {
        // the way out is open in proportion to the working gates; otherwise it is held in ferritin
        const open = working();
        if (open.length && Math.random() < open.length / DATA.SLOTS + 0.1) {
          const s = open[Math.floor(Math.random() * open.length)];
          p.stage = "exit";
          p.s = s;
        } else {
          let best = 0;
          FERRITIN.forEach((c, j) => (Math.hypot(c[0] - p.x, c[1] - p.y) < Math.hypot(FERRITIN[best][0] - p.x, FERRITIN[best][1] - p.y) ? (best = j) : 0));
          p.stage = "store";
          p.k = best;
        }
      } else if (p.stage === "exit") {
        if (p.s.state !== "on") p.stage = "cyto";
        else if (moveTo(p, p.s.x, BASAL - 2, 38, dt)) p.stage = "out";
      } else if (p.stage === "out" && moveTo(p, p.s.x, CAP.y0 + 6, 30, dt)) {
        const free = tf.filter((c) => c.load < 2 && c.x < p.x + 30 && c.x > p.x - 90).sort((a, b) => b.x - a.x)[0];
        if (free) {
          free.load++;
          irons.splice(i, 1);
        } else p.stage = "drift";
      } else if (p.stage === "drift") {
        p.x += 46 * dt;
        p.y += (CAP.y0 + 20 - p.y) * dt;
        if (p.x > DATA.W + 10) irons.splice(i, 1);
      } else if (p.stage === "store" && moveTo(p, FERRITIN[p.k][0], FERRITIN[p.k][1], 40, dt)) {
        fill[p.k] = Math.min(14, fill[p.k] + 1);
        irons.splice(i, 1);
      }
    }
    // ferritin slowly gives up iron as cells turn over (drawing only)
    for (let j = 0; j < fill.length; j++) fill[j] = Math.max(1, fill[j] - dt * 0.12);
    // gates: hepcidin docks on extra working gates and the cell pulls them in; missing gates come back
    const on = working().length + slots.filter((s) => s.state === "back").length;
    if (on > target && !heps.length) {
      const s = ORDER.map((i) => slots[i]).reverse().find((x) => x.state === "on");
      if (s) heps.push({ x: s.x + rnd(-40, 40), y: CAP.y1 - 6, s });
    }
    if (on < target) {
      const s = ORDER.map((i) => slots[i]).find((x) => x.state === "gone");
      if (s) {
        s.state = "back";
        s.t = 0;
      }
    }
    for (let i = heps.length - 1; i >= 0; i--) {
      const h = heps[i];
      if (moveTo(h, h.s.x, BASAL + 15, 40, dt)) {
        h.s.state = "bound";
        h.s.t = 0;
        heps.splice(i, 1);
      }
    }
    for (const s of slots) {
      s.t += dt;
      if (s.state === "bound" && s.t > 0.9) {
        s.state = "in";
        s.t = 0;
      } else if (s.state === "in" && s.t > 1.8) s.state = "gone";
      else if (s.state === "back" && s.t > 1.3) s.state = "on";
    }
    // blood moves right
    for (const c of rbc) c.x = c.x > DATA.W + 20 ? -20 : c.x + 40 * dt;
    for (const c of tf) if ((c.x += 34 * dt) > DATA.W + 20) Object.assign(c, { x: -20, load: 0 });
  }

  // ---------------------------------------------------------------- draw
  function draw() {
    let fp = "";
    let ves = "";
    for (const s of slots) {
      const chan = (y, a = 1) => `<g class="a1-fpn" opacity="${a.toFixed(2)}"><path d="${pill(s.x - 8, y - 15, 6.6, 30)}"/><path d="${pill(s.x + 1.4, y - 15, 6.6, 30)}"/></g>`;
      if (s.state === "on") fp += chan(BASAL);
      else if (s.state === "bound") fp += chan(BASAL) + `<path class="a1-hep" d="${hepPath(s.x, BASAL + 14)}"/>`;
      else if (s.state === "in") {
        const u = Math.min(1, s.t / 1.8);
        const y = BASAL - 70 * u;
        const a = u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4;
        ves += `<circle class="a1-vesicle" cx="${f1(s.x)}" cy="${f1(y)}" r="21" opacity="${a.toFixed(2)}"/>` + chan(y, a) + `<path class="a1-hep" opacity="${a.toFixed(2)}" d="${hepPath(s.x, y + 14)}"/>`;
      } else if (s.state === "back") {
        const u = Math.min(1, s.t / 1.3);
        const y = BASAL - 60 * (1 - u);
        ves += `<circle class="a1-vesicle" cx="${f1(s.x)}" cy="${f1(y)}" r="21" opacity="${(1 - u).toFixed(2)}"/>` + chan(y, Math.min(1, 0.3 + u));
      } else fp += `<path class="a1-gap" d="${pill(s.x - 8, BASAL - 3, 16, 6)}"/>`;
    }
    N.fpn.innerHTML = fp;
    N.ves.innerHTML = ves;
    N.iron.innerHTML = irons.map((p) => `<circle class="a1-iron" cx="${f1(p.x + (p.stage === "lumen" ? Math.sin(p.y * 0.08 + p.wob) * 3 : 0))}" cy="${f1(p.y)}" r="3.4"/>`).join("");
    N.hep.innerHTML = heps.map((h) => `<path class="a1-hep" d="${hepPath(h.x, h.y)}"/>`).join("");
    N.blood.innerHTML =
      rbc.map((c) => `<g class="a1-rbc"><ellipse cx="${f1(c.x)}" cy="${f1(c.y)}" rx="14" ry="6.5"/><ellipse class="a1-rbc-in" cx="${f1(c.x)}" cy="${f1(c.y)}" rx="7" ry="2.6"/></g>`).join("") +
      tf.map((c) => `<g class="a1-tf"><circle cx="${f1(c.x - 4)}" cy="${CAP.y0 + 20}" r="6.5"/><circle cx="${f1(c.x + 5)}" cy="${CAP.y0 + 21}" r="6.5"/>${c.load > 0 ? `<circle class="a1-iron" cx="${f1(c.x - 4)}" cy="${CAP.y0 + 20}" r="3"/>` : ""}${c.load > 1 ? `<circle class="a1-iron" cx="${f1(c.x + 5)}" cy="${CAP.y0 + 21}" r="3"/>` : ""}</g>`).join("");
    FERRITIN.forEach((c, j) => {
      const n = Math.round(fill[j]);
      let d = "";
      for (let i = 0; i < n; i++) {
        const a = i * 2.4;
        const r = 2.2 * Math.sqrt(i);
        d += `<circle class="a1-iron" cx="${f1(c[0] + r * Math.cos(a))}" cy="${f1(c[1] + r * Math.sin(a))}" r="2"/>`;
      }
      N.cores[j].innerHTML = d;
    });
    const n = working().length;
    out.fpn.textContent = `${n} of ${DATA.SLOTS}`;
  }

  // ---------------------------------------------------------------- scenes, input, tour, reduced motion
  function setScene(i, quiet) {
    sceneAt = i;
    const sc = DATA.scenes[i];
    gate = sc.gate;
    target = activeOf(gate);
    out.gate.textContent = `${Math.round(gate * 100)} % open`;
    sceneLine.textContent = sc.line;
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = `${buttons[i].textContent}: gut gate ${Math.round(gate * 100)} % open, ${target} of ${DATA.SLOTS} ferroportin channels working.`;
  }
  function renderStill() {
    // one frame: the gates already settled for this scene, iron on its way in and out, a hepcidin docking
    ORDER.forEach((k, j) => Object.assign(slots[k], { state: j < target ? "on" : "gone", t: 0 }));
    irons.length = 0;
    const w = working();
    DMT1.forEach((d, j) => irons.push({ x: d[0], y: j % 2 ? d[1] - 30 : APICAL + 14, stage: "in", d, wob: 0 }));
    w.forEach((s) => irons.push({ x: s.x, y: BASAL - 30, stage: "exit", s, wob: 0 }));
    const fills = [[3, 2, 3], [9, 7, 9], [12, 11, 12]][sceneAt];
    fills.forEach((v, j) => (fill[j] = v));
    if (target < DATA.SLOTS) {
      const g = ORDER.map((k) => slots[k]).find((s) => s.state === "gone");
      if (g) g.state = "bound";
    }
    draw();
  }
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      setScene(i);
      if (still.matches) renderStill();
    }),
  );
  fig.querySelector('[data-control="scene"]').addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    e.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  let touring = true;
  let idle = -1e9;
  let tourClock = 0;
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (touring && (tourClock += dt) > 8) {
      tourClock = 0;
      setScene((sceneAt + 1) % DATA.scenes.length, true);
    }
    step(dt);
    draw();
    raf = requestAnimationFrame(tick);
  }
  const start = () => {
    if (!raf && visible && !still.matches) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) start();
  }).observe(svg);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  setScene(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 120; i++) step(1 / 30);
    draw();
    start();
  }
}
