// A3 live code: one hot flash in the finger's skin, driven by Fig 1's flashAt(t). `louvre`
// opens the shunts (lumen widens, the nerve's squeeze stops, blood takes the shortcut into the
// plexus); `skin` sets how warm the skin glows and the heat rising off it; the monitor plots it.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="mode"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const set = (part, attr, v) => q(`[data-part="${part}"]`).setAttribute(attr, v);
  const MON = DATA.mon;

  // ---------------------------------------------------------------- colours from the theme
  const css = getComputedStyle(fig);
  const hex = (name, fb) => {
    const m = /^#?([0-9a-f]{6})$/i.exec((css.getPropertyValue(name) || fb).trim()) || /^#?([0-9a-f]{6})$/i.exec(fb);
    return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  };
  const VENC = hex("--a3-ven", "#5a5fa8");
  const ARTC = hex("--a3-art", "#d0463a");
  const mix = (t) => `rgb(${[0, 1, 2].map((i) => Math.round(VENC[i] + (ARTC[i] - VENC[i]) * t)).join(",")})`;

  // ---------------------------------------------------------------- geometry helpers
  function curve(points, samples = 8) {
    const o = [];
    const n = points.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(n - 1, i + 2)];
      for (let s = 0; s < samples; s++) {
        const t = s / samples, t2 = t * t, t3 = t2 * t;
        o.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
      }
    }
    o.push(points[n - 1]);
    return o;
  }
  function tube(c, w) {
    const L = [];
    const R = [];
    c.forEach((p, i) => {
      const a = c[Math.max(0, i - 1)];
      const b = c[Math.min(c.length - 1, i + 1)];
      let nx = -(b[1] - a[1]);
      let ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
      L.push([p[0] + (nx * w) / 2, p[1] + (ny * w) / 2]);
      R.push([p[0] - (nx * w) / 2, p[1] - (ny * w) / 2]);
    });
    return `M${[...L, ...R.reverse()].map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z`;
  }
  const measure = (pts) => {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, acc, L: acc[acc.length - 1] };
  };
  const along = (m, s) => {
    let lo = 1;
    let hi = m.acc.length - 1;
    const x = Math.max(0, Math.min(m.L, s));
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (m.acc[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    const a = m.pts[lo - 1];
    const b = m.pts[lo];
    const t = (x - m.acc[lo - 1]) / (m.acc[lo] - m.acc[lo - 1] || 1);
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, tx: (b[0] - a[0]) / l, ty: (b[1] - a[1]) / l };
  };

  // ---------------------------------------------------------------- routes for blood
  const ART = DATA.artery;
  const PLX = DATA.plexus;
  const upTo = (pts, x) => pts.filter((p) => p[0] <= x);
  const from = (pts, x) => pts.filter((p) => p[0] >= x);
  const route = (parts) => {
    // parts: [points, kind]; each kind has its own speed; venous after a capillary bed
    const pts = [];
    const marks = [];
    for (const [p, kind] of parts) {
      if (!p.length) continue;
      const start = pts.length;
      pts.push(...p);
      marks.push({ start, kind });
    }
    const m = measure(pts);
    m.kinds = marks.map((k, i) => ({ kind: k.kind, from: m.acc[k.start], to: i + 1 < marks.length ? m.acc[marks[i + 1].start] : m.L }));
    return m;
  };
  const ROUTES = {
    through: [route([[ART, "art"]])],
    caps: DATA.feeds.map((x, k) => {
      const loop = DATA.loops.reduce((b, l) => (Math.abs(l.up[0][0] - x) < Math.abs(b.up[0][0] - x) ? l : b));
      return route([[upTo(ART, x), "art"], [curve([[x, DATA.artY - 4], [x + 6, 270], [x - 4, 230], [x + 3, 200], [loop.up[0][0], loop.up[0][1]]]), "feed"], [curve([...loop.up, ...loop.down]), "cap"], [from(PLX, loop.down[2][0]), "plexV"]]);
    }),
    shunts: DATA.avas.map((pts) => route([[upTo(ART, pts[0][0]), "art"], [pts, "ava"], [from(PLX, pts[pts.length - 1][0]), "plexA"]])),
  };
  const NERVE = measure(curve(DATA.nerve, 10));

  // ---------------------------------------------------------------- state
  let mode = 0;
  let s = 0;
  let t = -1;
  let open = 0;
  let phase = -1;
  const cells = [];
  const spikes = [];
  const rate = { through: 5, caps: 1.1, shunts: 9 };
  const debt = { through: 0, caps: 0, shunts: 0 };
  const speedOf = (kind) => ({ art: 120, feed: 34, cap: 22, plexV: 34 + 40 * open, ava: 40 + 170 * open, plexA: 60 + 110 * open })[kind];
  function step(dt) {
    const fl = flashAt(t);
    open = fl.louvre;
    // blood: the shunts carry blood only when they're open
    for (const [key, list] of Object.entries(ROUTES)) {
      const r = key === "shunts" ? rate.shunts * open * open : rate[key];
      debt[key] += r * dt * list.length;
      while (debt[key] >= 1) {
        debt[key] -= 1;
        cells.push({ m: list[Math.floor(Math.random() * list.length)], s: 0, j: (Math.random() - 0.5) * 3 });
      }
    }
    for (let i = cells.length - 1; i >= 0; i--) {
      const c = cells[i];
      const k = c.m.kinds.find((kk) => c.s < kk.to) ?? c.m.kinds[c.m.kinds.length - 1];
      c.kind = k.kind;
      c.s += speedOf(k.kind) * dt;
      if (c.s >= c.m.L) cells.splice(i, 1);
    }
    // the nerve fires while it holds the shunts shut
    if (Math.random() < dt * 9 * (1 - open)) spikes.push({ s: 0 });
    for (let i = spikes.length - 1; i >= 0; i--) {
      spikes[i].s += dt * 220;
      if (spikes[i].s > NERVE.L) spikes.splice(i, 1);
    }
  }
  function draw() {
    const fl = flashAt(t);
    const warm = Math.max(0, fl.skin) / TRUTH.skinRise;
    // vessels
    set("art", "d", tube(ART, 13));
    set("plex", "d", tube(PLX, 7 + 7 * open));
    q('[data-part="plex"]').style.fill = mix(0.15 + 0.6 * open);
    set("avaWall", "d", DATA.avas.map((p) => tube(p, 7 + 6 * open)).join(""));
    set("ava", "d", DATA.avas.map((p) => tube(p, 1.6 + 7.4 * open)).join(""));
    q('[data-part="ava"]').style.fill = mix(0.4 + 0.6 * open);
    // warmth in the skin and heat rising off it
    set("warm", "opacity", (0.6 * warm).toFixed(2));
    let heat = "";
    if (warm > 0.03)
      for (let k = 0; k < 9; k++) {
        const x0 = 50 + k * 62;
        let d = "";
        for (let y = 86; y >= 18; y -= 6) {
          const x = x0 + 5 * Math.sin(y * 0.12 + performance.now() / 260 + k);
          d += `${d ? "L" : "M"}${f1(x)} ${y}`;
        }
        heat += d;
      }
    set("heat", "d", heat);
    q('[data-part="heat"]').style.opacity = (0.75 * warm).toFixed(2);
    // cells: oxygen-rich in the artery, the shunts and the plexus they flood; darker after the loops
    let a = "";
    let v = "";
    for (const c of cells) {
      const p = along(c.m, c.s);
      const rx = 3.1;
      const ang = ((Math.atan2(p.ty, p.tx) * 180) / Math.PI).toFixed(0);
      const x = p.x - p.ty * c.j;
      const y = p.y + p.tx * c.j;
      const e = `M${f1(x - p.tx * rx)} ${f1(y - p.ty * rx)}A${rx} 2 ${ang} 1 0 ${f1(x + p.tx * rx)} ${f1(y + p.ty * rx)}A${rx} 2 ${ang} 1 0 ${f1(x - p.tx * rx)} ${f1(y - p.ty * rx)}Z`;
      if (c.kind === "plexV" || c.kind === "cap") v += e;
      else a += e;
    }
    set("cellsA", "d", a);
    set("cellsV", "d", v);
    set("spikes", "d", spikes.map((sp) => {
      const p = along(NERVE, sp.s);
      return `M${f1(p.x - 2.6)} ${f1(p.y)}a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0`;
    }).join(""));
    // monitor
    const xOf = (tt) => MON.x0 + ((tt - MON.t0) / (MON.t1 - MON.t0)) * (MON.x1 - MON.x0);
    const yOf = (vv) => MON.y0 - (vv / MON.max) * (MON.y0 - MON.y1);
    let d = "";
    for (let tt = MON.t0; tt <= t + 1e-9; tt += 0.1) d += `${d ? "L" : "M"}${f1(xOf(tt))} ${f1(yOf(flashAt(tt).skin))}`;
    set("curve", "d", d);
    set("mdot", "cx", f1(xOf(t)));
    set("mdot", "cy", f1(yOf(fl.skin)));
    out.min.textContent = t < 0 ? "before" : t < 10 ? t.toFixed(1) : `${Math.round(t)}`;
    out.skin.textContent = `+${Math.max(0, fl.skin).toFixed(1)} °C`;
    out.hr.textContent = `+${Math.round(fl.hr)} bpm`;
    const ph = t < 0 ? 0 : open > 0.05 ? 1 : 2;
    if (ph !== phase) {
      phase = ph;
      line.textContent = [
        "Between flashes: the nerve keeps the shunts squeezed shut, and blood takes the slow road through the capillary loops.",
        "The flash: the squeeze lifts, the shunts open, and warm blood floods the veins just under the skin.",
        "The shunts close again within minutes, but the skin gives up its heat slowly: still warm half an hour later.",
      ][ph];
    }
  }

  // ---------------------------------------------------------------- input, loop
  function setMode(i, quiet) {
    mode = i;
    s = 0;
    t = -1;
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = i === 0 ? `A hot flash: the finger's skin warms about ${TRUTH.skinRise} degrees within a minute and stays warm for about half an hour.` : "Between flashes: the shunts stay shut.";
  }
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      setMode(i);
      if (still.matches) renderStill();
    }),
  );
  fig.querySelector('[data-control="mode"]').addEventListener("keydown", (ev) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const j = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? i + 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? i - 1 : null;
    if (j === null) return;
    ev.preventDefault();
    const b = buttons[(j + buttons.length) % buttons.length];
    b.focus();
    b.click();
  });
  function renderStill() {
    t = mode === 0 ? 1 : -1;
    cells.length = 0;
    spikes.length = 0;
    for (let i = 0; i < 360; i++) step(1 / 60);
    draw();
  }
  let raf = 0;
  let last = 0;
  let visible = true;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (mode === 0) {
      s += dt;
      if (s > loopSeconds()) s = 0;
      t = minuteAt(s);
    } else t = -1;
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
    visible = entries.some((en) => en.isIntersecting);
    if (visible) start();
  }).observe(svg);
  still.addEventListener("change", () => (still.matches ? renderStill() : start()));
  setMode(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 180; i++) step(1 / 60);
    draw();
    start();
  }
}
