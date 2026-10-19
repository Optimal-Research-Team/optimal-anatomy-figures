// Part and assembly counts for REPORT.md (node only, no browser)
import { scene } from "../object/scene.mjs";
import { FILM } from "../object/film.mjs";
const S = scene({ W: 640, H: 640, radius: FILM.radius });
const parts = S.T.parts.filter((p) => !p.dead);
const top = (g) => { let x = g; while (x && x.parent && x.parent.name !== "root") x = x.parent; return x ? x.name : "root"; };
const by = new Map();
for (const p of parts) { const k = top(p.group); by.set(k, (by.get(k) ?? 0) + 1); }
const AREA = (k) => (/^(core|foot\.|wall\.|cover)/.test(k) ? "Footplate" : "Column + head + grips");
const areas = new Map();
for (const [k, n] of by) areas.set(AREA(k), (areas.get(AREA(k)) ?? 0) + n);
console.log(`parts ${S.out.report.parts} (live list ${parts.length}) · explode assemblies ${S.obj.explode.length} · groups ${S.T.groups.length}`);
console.log([...areas].map(([a, n]) => `${a}: ${n}`).join(" · "));
const sub = new Map();
const second = (g) => { const chain = []; for (let x = g; x && x.name !== "root"; x = x.parent) chain.unshift(x.name); return chain.slice(0, 2).join(" > ") || "root"; };
for (const p of parts) { const k = second(p.group); sub.set(k, (sub.get(k) ?? 0) + 1); }
for (const [k, n] of [...sub].sort()) console.log(`${String(n).padStart(3)}  ${k}`);
console.log("explode:", S.obj.explode.map((e) => e.name).join(", "));
