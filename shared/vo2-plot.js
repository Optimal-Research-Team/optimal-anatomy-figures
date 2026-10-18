// The tablet's live screen for the VO₂ figures (inlined into the page after the kit).
// Plots oxygen uptake (mL/kg/min) against the test's work (watts on a bike, km/h on a treadmill),
// with a dashed guide for the shared slope, the live trace, the current point, the ceiling once
// it shows, and the big VO₂ number with a breath marker.
function vo2Plot(host, screen, { xMin = 0, xMax, yMax = 60, xTicks, yTicks = [20, 40, 60], guide, xLabel }) {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k2, v] of Object.entries(attrs)) n.setAttribute(k2, v);
    host.appendChild(n);
    return n;
  };
  const head = 5.4; // the number strip at the top
  const box = { x0: 3.6, y0: screen.h - 2.6, w: screen.w - 5.2, h: screen.h - head - 4 };
  const px = (x) => box.x0 + ((x - xMin) / (xMax - xMin)) * box.w;
  const py = (v) => box.y0 - (v / yMax) * box.h;
  let grid = "";
  for (const x of xTicks) grid += `M${px(x).toFixed(2)} ${py(0).toFixed(2)}V${py(yMax).toFixed(2)}`;
  for (const v of yTicks) grid += `M${px(xMin).toFixed(2)} ${py(v).toFixed(2)}H${px(xMax).toFixed(2)}`;
  el("path", { class: "vp-grid", d: grid });
  el("path", { class: "vp-axis", d: `M${px(xMin)} ${py(yMax)}V${py(0)}H${px(xMax)}` });
  if (guide) el("path", { class: "vp-guide", d: `M${px(guide[0][0]).toFixed(2)} ${py(guide[0][1]).toFixed(2)}L${px(guide[1][0]).toFixed(2)} ${py(guide[1][1]).toFixed(2)}` });
  for (const x of xTicks) el("text", { class: "vp-tick", x: px(x).toFixed(2), y: (py(0) + 1.9).toFixed(2), "font-size": 1.5, "text-anchor": "middle" }).textContent = String(x);
  for (const v of yTicks) el("text", { class: "vp-tick", x: (px(xMin) - 0.5).toFixed(2), y: (py(v) + 0.5).toFixed(2), "font-size": 1.5, "text-anchor": "end" }).textContent = String(v);
  el("text", { class: "vp-unit", x: px(xMax).toFixed(2), y: (py(0) - 0.8).toFixed(2), "font-size": 1.5, "text-anchor": "end" }).textContent = xLabel;
  const big = el("text", { class: "vp-big", x: 1.6, y: 4.3, "font-size": 3.6 });
  el("text", { class: "vp-unit", x: 12.4, y: 4.3, "font-size": 1.6 }).textContent = "mL/kg/min VO₂";
  const breath = el("circle", { class: "vp-breath", cx: screen.w - 2.4, cy: 2.8, r: 0.8 });
  const ceil = el("path", { class: "vp-ceiling" });
  const trace = el("path", { class: "vp-trace" });
  const dot = el("circle", { class: "vp-dot", r: 0.7 });
  return {
    draw(points, now, ceiling, seen, pulse) {
      let d = "";
      for (const [x, v] of points) d += `${d ? "L" : "M"}${px(x).toFixed(2)} ${py(v).toFixed(2)}`;
      trace.setAttribute("d", d);
      dot.setAttribute("cx", px(now[0]).toFixed(2));
      dot.setAttribute("cy", py(now[1]).toFixed(2));
      ceil.setAttribute("d", `M${px(xMin).toFixed(2)} ${py(ceiling).toFixed(2)}H${px(xMax).toFixed(2)}`);
      ceil.setAttribute("stroke-opacity", seen.toFixed(2));
      big.textContent = now[1].toFixed(1);
      breath.setAttribute("fill-opacity", (0.25 + 0.75 * pulse).toFixed(2));
    },
  };
}
