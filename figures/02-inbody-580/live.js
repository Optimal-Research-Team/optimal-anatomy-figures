// Fig 2 live code: the current dots, the meters, the switch, the screen, the readout.
// The page inlines the kit, model.mjs and this file, then calls mount(figure).
const DATA = __DATA__;

function mount(fig) {
  const stage = fig.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const ohmLabel = fig.querySelector('[data-stat="ohm"] dt');
  const status = fig.querySelector("[data-status]");
  const groups = { freq: [...fig.querySelectorAll('[data-control="freq"] .opt-seg-btn')], seg: [...fig.querySelectorAll('[data-control="seg"] .opt-seg-btn')] };
  const FREQS = TRUTH.freqs;
  const SEG_NAMES = { arm: "Arm", trunk: "Trunk", leg: "Leg", body: "Body" };
  const KIND = (name) => (name.startsWith("arm") ? "arm" : name.startsWith("leg") ? "leg" : "trunk");
  const MET = DATA.meter;
  const SPEED = 9; // world units per second through a 9-lane section; narrower sections run faster (same current)

  // ---------------------------------------------------------------- dots: one set per segment on the measured (right) path
  const NS = "http://www.w3.org/2000/svg";
  const paths = DATA.segs.filter((s) => s.current).map((seg) => {
    const host = svg.querySelector(`[data-dots="${seg.name}"]`);
    const lanes = seg.colY.length + seg.gapY.length;
    const spacing = 4.2;
    const count = Math.round(((seg.len - 2 * seg.cap) / spacing) * lanes * 0.55);
    const dots = Array.from({ length: count }, (_, i) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", "0.42");
      host.appendChild(c);
      return { node: c, s: seg.cap + ((i * 0.618034) % 1) * (seg.len - 2 * seg.cap), lane: 0, through: false, wraps: i };
    });
    // the arm carries current up to the shoulder; trunk and leg carry it down
    const dir = seg.name.startsWith("arm") ? 1 : -1;
    return { seg, kind: KIND(seg.name), dots, lanes, dir };
  });
  let seq = 0;
  const pick = (d, share, seg) => {
    seq = (seq + 0.754877666) % 1; // low-discrepancy sequence, so the share is met smoothly
    d.through = seq < share;
    const list = d.through ? seg.colY : seg.gapY;
    d.lane = list[Math.floor(((seq * 7.13 + d.wraps * 0.381966) % 1) * list.length)];
  };

  // ---------------------------------------------------------------- state
  let fi = 0;
  let seg = "arm";
  const needles = Object.fromEntries(Object.keys(DATA.meters).map((name) => [name, { x: 0, v: 0 }]));
  let touring = !still.matches;
  let tourClock = 0;
  let visible = false;
  let frame = 0;
  let last = 0;
  let idle = 0;
  const shareNow = (kind) => throughShare(kind, FREQS[fi]);

  paths.forEach((p) => p.dots.forEach((d) => pick(d, shareNow(p.kind), p.seg)));

  const needleAngle = (name) => {
    const z = impedance(KIND(name), FREQS[fi]).Z;
    return MET.from + Math.min(1, z / MET.max) * MET.span;
  };
  const screenHost = svg.querySelector('[data-part="screen"]');
  const switchNode = svg.querySelector('[data-part="switch"]');
  const detents = [...svg.querySelectorAll("[data-detent]")];

  function drawStatic() {
    const f = FREQS[fi];
    const z = impedance(seg, f).Z;
    out.freq.textContent = `${f} kHz`;
    ohmLabel.textContent = SEG_NAMES[seg];
    out.ohm.textContent = `${Math.round(z)} Ω`;
    const lit = seg === "body" ? ["armR", "trunk", "legR"] : seg === "trunk" ? ["trunk"] : [`${seg}R`];
    svg.querySelectorAll("[data-needle]").forEach((n) => (lit.includes(n.dataset.needle) ? n.setAttribute("data-on", "") : n.removeAttribute("data-on")));
    const sw = DATA.sw;
    const ang = -60 + fi * 40;
    switchNode.setAttribute("transform", `rotate(${ang} ${sw.x} ${sw.y})`);
    detents.forEach((d, i) => (i === fi ? d.setAttribute("data-on", "") : d.removeAttribute("data-on")));
    const scr = DATA.screen;
    const cx = (scr.x0 + scr.x1) / 2;
    const bars = FREQS.map((_, i) => {
      const w = (scr.x1 - scr.x0 - 6) / 4;
      return `<rect class="ib-screen-bar"${i === fi ? " data-on" : ""} x="${(scr.x0 + 3 + i * w + 0.4).toFixed(2)}" y="${(scr.y1 - 3).toFixed(2)}" width="${(w - 0.8).toFixed(2)}" height="1.2" rx="0.4"/>`;
    }).join("");
    screenHost.innerHTML = `<text class="ib-screen-text" x="${cx}" y="${(scr.y0 + scr.y1) / 2 + 1}" font-size="4.4" text-anchor="middle">${f} kHz</text>${bars}`;
    const valuetext = `${f} kHz, ${SEG_NAMES[seg].toLowerCase()} ${Math.round(z)} ohms; about ${Math.round(throughShare(seg, f) * 100)} % of the current passes through the cells`;
    stage.setAttribute("aria-valuetext", valuetext);
    groups.freq.forEach((b, i) => setPressed(b, i === fi));
    groups.seg.forEach((b) => setPressed(b, b.dataset.value === seg));
  }
  const setPressed = (b, on) => {
    b.setAttribute("aria-checked", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
  };

  function step(dt) {
    const calm = still.matches;
    if (touring) {
      tourClock += dt;
      const beat = Math.floor(tourClock / 2.8);
      const nfi = beat % FREQS.length;
      const nseg = ["arm", "trunk", "leg", "body"][Math.floor(beat / FREQS.length) % 4];
      if (nfi !== fi || nseg !== seg) {
        fi = nfi;
        seg = nseg;
        drawStatic();
      }
    }
    for (const [name, n] of Object.entries(needles)) {
      const target = needleAngle(name);
      if (calm) {
        n.x = target;
        n.v = 0;
        continue;
      }
      const w = 1 / 0.22;
      for (let i = 0; i < 4; i++) {
        n.v += (w * w * (target - n.x) - 1.3 * w * n.v) * (dt / 4);
        n.x += n.v * (dt / 4);
      }
    }
    if (calm) return;
    for (const p of paths) {
      const v = (SPEED * 9) / p.lanes;
      const share = shareNow(p.kind);
      const L0 = p.seg.cap + 0.4;
      const L1 = p.seg.len - p.seg.cap - 0.4;
      for (const d of p.dots) {
        d.s += p.dir * v * dt;
        if (d.s > L1 || d.s < L0) {
          d.s = p.dir > 0 ? L0 + (d.s - L1) : L1 - (L0 - d.s);
          d.wraps++;
          pick(d, share, p.seg);
        }
      }
    }
  }

  function draw() {
    for (const [name, n] of Object.entries(needles)) {
      const node = svg.querySelector(`[data-needle="${name}"]`);
      const d = node.getAttribute("d").match(/M([\d.]+) ([\d.]+)/);
      const px = Number(d[1]);
      const py = Number(d[2]) - 1;
      node.setAttribute("transform", `rotate(${n.x.toFixed(2)} ${px} ${py})`);
    }
    for (const p of paths)
      for (const d of p.dots) {
        d.node.setAttribute("cx", d.s.toFixed(2));
        d.node.setAttribute("cy", d.lane.toFixed(2));
        if (d.through) d.node.setAttribute("data-in", "");
        else d.node.removeAttribute("data-in");
      }
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    step(dt);
    draw();
    frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (!frame && visible && !still.matches) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  function takeOver() {
    touring = false;
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (still.matches) return;
      touring = true;
      tourClock = fi * 2.8;
      run();
    }, 3600);
  }
  function set(nfi, nseg) {
    fi = Math.max(0, Math.min(FREQS.length - 1, nfi));
    seg = nseg;
    takeOver();
    drawStatic();
    if (still.matches) {
      // one still frame: dots placed for this frequency's share, needles at their readings
      paths.forEach((p) => p.dots.forEach((d) => pick(d, shareNow(p.kind), p.seg)));
      step(0);
      draw();
    }
    status.textContent = stage.getAttribute("aria-valuetext");
    run();
  }

  groups.freq.forEach((b, i) => b.addEventListener("click", () => set(i, seg)));
  groups.seg.forEach((b) => b.addEventListener("click", () => set(fi, b.dataset.value)));
  for (const [name, list] of Object.entries(groups)) {
    fig.querySelector(`[data-control="${name}"]`).addEventListener("keydown", (e) => {
      const i = list.indexOf(e.target);
      const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
      if (next === null || i < 0) return;
      e.preventDefault();
      const b = list[(next + list.length) % list.length];
      b.focus();
      b.click();
    });
  }
  stage.addEventListener("keydown", (e) => {
    const order = ["arm", "trunk", "leg", "body"];
    const si = order.indexOf(seg);
    if (e.key === "ArrowRight") set(fi + 1, seg);
    else if (e.key === "ArrowLeft") set(fi - 1, seg);
    else if (e.key === "ArrowDown") set(fi, order[(si + 1) % 4]);
    else if (e.key === "ArrowUp") set(fi, order[(si + 3) % 4]);
    else if (e.key === "Home") set(0, seg);
    else if (e.key === "End") set(FREQS.length - 1, seg);
    else return;
    e.preventDefault();
  });
  stage.addEventListener("click", (e) => {
    const hit = e.target.closest("[data-seg]");
    if (hit) set(fi, KIND(hit.dataset.seg));
    else set((fi + 1) % FREQS.length, seg);
  });
  still.addEventListener?.("change", () => {
    touring = !still.matches;
    run();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  ).observe(stage);

  if (still.matches) {
    fi = 1;
    seg = "body";
  }
  drawStatic();
  step(0);
  for (const n of Object.values(needles)) n.x = MET.from;
  if (still.matches) step(0);
  draw();
}
