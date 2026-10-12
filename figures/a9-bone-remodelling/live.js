// A9 live code: remodelling sites start along the strut's top surface at remodelOf(e).perYear;
// each follows depthAt(age, fill): an osteoclast digs, a pause, then osteoblasts refill. When a
// site finishes, whatever it didn't refill stays as a permanent dip and its cavity floor stays
// as a cement line. The readout is the strut's bone area against the start.
const DATA = __DATA__;

function mount(fig) {
  const svg = fig.querySelector("svg");
  const q = (s) => svg.querySelector(s);
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const out = Object.fromEntries([...fig.querySelectorAll("[data-r]")].map((n) => [n.dataset.r, n]));
  const status = fig.querySelector("[data-status]");
  const line = fig.querySelector("[data-scene]");
  const buttons = [...fig.querySelectorAll('[data-control="state"] .opt-seg-btn')];
  const f1 = (v) => v.toFixed(1);
  const set = (part, d) => q(`[data-part="${part}"]`).setAttribute("d", d);
  const { X0, X1, TOP, BOT } = DATA;
  const STEP = 2;
  const NX = Math.round((X1 - X0) / STEP) + 1;
  const xs = Array.from({ length: NX }, (_, i) => X0 + i * STEP);
  const yBot = (x) => BOT + 3 * Math.sin(x / 47);
  const yTop0 = (x) => TOP + 2.2 * Math.sin(x / 39) + 1.4 * Math.sin(x / 13);
  const startArea = xs.reduce((s, x) => s + (yBot(x) - yTop0(x)), 0);
  const dot = (x, y, r) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

  // ---------------------------------------------------------------- state
  let target = 1;
  let e = 1;
  let day = 0;
  let dip = new Float32Array(NX); // permanent loss from finished sites, px
  const sites = [];
  let cementNew = [];
  const estro = [];
  function reset() {
    day = 0;
    dip = new Float32Array(NX);
    sites.length = 0;
    cementNew = [];
  }
  function startSite(fill) {
    for (let tries = 0; tries < 20; tries++) {
      const x0 = X0 + 16 + Math.random() * (X1 - X0 - 32 - BONE.width);
      if (sites.every((s) => Math.abs(s.x0 - x0) > BONE.width + 8)) {
        sites.push({ x0, age: 0, fill, depth: BONE.depth * (0.85 + Math.random() * 0.3), w: BONE.width * (0.85 + Math.random() * 0.3) });
        return;
      }
    }
  }
  function stepDays(dd) {
    e += (target - e) * (1 - Math.exp(-dd / 40));
    const r = remodelOf(e);
    day += dd;
    // new sites: a Poisson stream at the current rate
    if (Math.random() < (r.perYear / 365) * dd) startSite(r.fill);
    for (let i = sites.length - 1; i >= 0; i--) {
      const s = sites[i];
      s.age += dd;
      if (s.age >= cycleDays()) {
        // what wasn't refilled stays; the cavity floor becomes a cement line
        const left = depthAt(cycleDays(), s.fill); // the share of the cavity never refilled
        const pts = [];
        xs.forEach((x, k) => {
          const u = (x - s.x0) / s.w;
          if (u > 0 && u < 1) {
            dip[k] += left * s.depth * scoop(u);
            pts.push([x, yTop0(x) + dip[k] - left * s.depth * scoop(u) + s.depth * scoop(u)]);
          }
        });
        cementNew.push(pts);
        if (cementNew.length > 22) cementNew.shift();
        sites.splice(i, 1);
      }
    }
  }
  function profile() {
    const y = xs.map((x, k) => yTop0(x) + dip[k]);
    for (const s of sites) {
      const d = depthAt(s.age, s.fill) * s.depth;
      xs.forEach((x, k) => {
        const u = (x - s.x0) / s.w;
        if (u > 0 && u < 1) y[k] += d * scoop(u);
      });
    }
    return y;
  }
  function stepEstro(dt) {
    const want = Math.round(22 * e);
    if (estro.length < want && Math.random() < dt * 6) estro.push({ x: 20 + Math.random() * 560, y: 50 + Math.random() * (TOP - 70), vx: 0, vy: 0, age: 0, life: 5 + Math.random() * 4 });
    for (let i = estro.length - 1; i >= 0; i--) {
      const m = estro[i];
      m.age += dt;
      m.vx += (Math.random() - 0.5) * 60 * dt;
      m.vy += (Math.random() - 0.5) * 60 * dt;
      m.vx *= 1 - 0.8 * dt;
      m.vy *= 1 - 0.8 * dt;
      m.x += m.vx * dt;
      m.y = Math.max(46, Math.min(TOP - 16, m.y + m.vy * dt));
      if (m.age > m.life || (estro.length > want + 1 && Math.random() < dt)) estro.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------- drawing
  function draw() {
    const y = profile();
    const top = xs.map((x, k) => `${k ? "L" : "M"}${f1(x)} ${f1(y[k])}`).join("");
    const bottom = [...xs].reverse().map((x) => `L${f1(x)} ${f1(yBot(x))}`).join("");
    set("bone", `${top}${bottom}Z`);
    set("boneClip", `${top}${bottom}Z`);
    set("surface", top);
    set("cementNew", cementNew.map((pts) => pts.map((p, k) => `${k ? "L" : "M"}${f1(p[0])} ${f1(p[1])}`).join("")).join(""));
    // cells on the surface
    let oc = "";
    let ruffle = "";
    let ocNuc = "";
    let ob = "";
    let obNuc = "";
    let osteoid = "";
    let rev = "";
    const busy = [];
    for (const s of sites) {
      busy.push([s.x0 - 6, s.x0 + s.w + 6]);
      const ph = s.age < BONE.resorb ? 0 : s.age < BONE.resorb + BONE.reverse ? 1 : 2;
      const at = (u) => {
        const x = s.x0 + u * s.w;
        const k = Math.max(0, Math.min(NX - 1, Math.round((x - X0) / STEP)));
        return [x, y[k]];
      };
      if (ph === 0) {
        // the osteoclast: a big multinucleated cell nestled in the cavity, ruffled border down
        const pts = [];
        for (let u = 0.08; u <= 0.92; u += 0.07) pts.push(at(u));
        const crest = Math.min(...pts.map((p) => p[1])) - 15;
        const outline = [...pts.map(([x, yy]) => [x, yy - 1.5]), [s.x0 + s.w * 0.88, crest + 4], [s.x0 + s.w * 0.62, crest - 2], [s.x0 + s.w * 0.36, crest - 1], [s.x0 + s.w * 0.12, crest + 5]];
        oc += smoothD(outline);
        ruffle += pts.map(([x, yy], k) => `${k ? "L" : "M"}${f1(x)} ${f1(yy - 1.5 - (k % 2) * 2.4)}`).join("");
        for (let k = 0; k < 4; k++) {
          const [x, yy] = at(0.25 + k * 0.16);
          ocNuc += dot(x, Math.min(yy - 7, crest + 9), 2.6);
        }
      } else if (ph === 1) {
        for (const u of [0.32, 0.66]) {
          const [x, yy] = at(u);
          rev += dot(x, yy - 3.2, 3.2);
        }
      } else {
        // osteoblasts in a row on the new bone, pale osteoid under them
        const pts = [];
        for (let u = 0.06; u <= 0.94; u += 0.02) pts.push(at(u));
        osteoid += pts.map(([x, yy], k) => `${k ? "L" : "M"}${f1(x)} ${f1(yy + 2)}`).join("");
        for (let u = 0.1; u <= 0.9; u += 0.135) {
          const [x, yy] = at(u);
          ob += `M${f1(x - 4)} ${f1(yy - 0.5)}h8v-8.5q0 -2 -2 -2h-4q-2 0 -2 2Z`;
          obNuc += dot(x, yy - 6.5, 1.8);
        }
      }
    }
    set("oc", oc);
    set("ocRuffle", ruffle);
    set("ocNuc", ocNuc);
    set("ob", ob);
    set("obNuc", obNuc);
    set("osteoid", osteoid);
    set("rev", rev);
    // flat lining cells on the quiet surface
    let lining = "";
    for (let x = X0 + 14; x < X1 - 10; x += 26) {
      if (busy.some(([a, b]) => x > a && x < b)) continue;
      const k = Math.round((x - X0) / STEP);
      const yy = y[k];
      const k2 = Math.min(NX - 1, k + 4);
      const sl = (y[k2] - yy) / (STEP * (k2 - k) || 1);
      lining += `M${f1(x - 9)} ${f1(yy - 9 * sl - 0.8)}q9 ${f1(-3.4 + 0)} 18 ${f1(18 * sl)}q-9 ${f1(1 - 9 * sl)} -18 ${f1(-18 * sl)}Z`;
    }
    set("lining", lining);
    // estrogen
    set("estro", estro.map((m) => {
      const r = 3 * Math.min(1, m.age / 0.5, (m.life - m.age) / 0.5);
      if (r <= 0.3) return "";
      let d = "";
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * 2 * Math.PI + Math.PI / 6;
        d += `${k ? "L" : "M"}${f1(m.x + Math.cos(a) * r)} ${f1(m.y + Math.sin(a) * r)}`;
      }
      return d + "Z";
    }).join(""));
    // readouts
    const area = xs.reduce((sum, x, k) => sum + (yBot(x) - y[k]), 0);
    out.yr.textContent = (day / 365).toFixed(1);
    out.sites.textContent = String(sites.length);
    const ch = 100 * (area / startArea - 1);
    out.bone.textContent = Math.abs(ch) < 0.05 ? "100%" : `${(100 + ch).toFixed(1)}%`;
  }
  function smoothD(points) {
    const n = points.length;
    const at = (i) => points[(i + n) % n];
    let d = `M${f1(points[0][0])} ${f1(points[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + "Z";
  }

  // ---------------------------------------------------------------- input, tour, loop
  let stateAt = 0;
  function setState(i, quiet) {
    stateAt = i;
    target = i === 0 ? 1 : 0;
    e = target;
    reset();
    line.textContent = DATA.lines[i];
    buttons.forEach((b, j) => {
      b.setAttribute("aria-checked", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    if (!quiet) status.textContent = DATA.lines[i];
  }
  let touring = true;
  let idle = -1e9;
  const takeOver = () => {
    touring = false;
    idle = performance.now();
  };
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      takeOver();
      setState(i);
      if (still.matches) renderStill();
    }),
  );
  for (const b of buttons) b.addEventListener("pointerdown", takeOver);
  fig.querySelector('[data-control="state"]').addEventListener("keydown", (ev) => {
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
    // two years in, with whatever sites are open at that moment
    reset();
    while (day < 730) stepDays(1);
    for (let i = 0; i < 300; i++) stepEstro(1 / 30);
    draw();
  }
  let raf = 0;
  let last = 0;
  let visible = true;
  let hold = 0;
  function tick(now) {
    raf = 0;
    if (!visible || still.matches) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (!touring && now - idle > 9000) touring = true;
    if (day < BONE.years * 365) stepDays(dt * BONE.pace);
    else if ((hold += dt) > 2.5) {
      hold = 0;
      if (touring) setState(1 - stateAt, true);
      else reset();
    }
    stepEstro(dt);
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
  setState(0, true);
  if (still.matches) renderStill();
  else {
    for (let i = 0; i < 60; i++) stepEstro(1 / 30);
    draw();
    start();
  }
}
