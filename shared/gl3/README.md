# shared/gl3: the real-time 3-D layer

One WebGL layer per figure, under the figure's own SVG. It renders the solids the figure already draws (the kit
records every slab, turned body, tube and ball in world units) with physically based materials, a studio
environment, soft shadows on the floor and ambient occlusion, in the kit's own camera. The SVG stays on top as the
ink pass: solid fills go white and the SVG multiplies over the canvas, so every tick, label, screen and hit target
still lands on the right surface, and nearer solids still hide what is behind them.

The SVG is still the figure when the layer can't run: no WebGL 2, a software renderer, Save-Data or 2G, under 3 GB
of memory, under 4 cores, a lost context, `gl="off"` on the element or `?gl=off` on a page. Rule 6 of the repo
(`CLAUDE.md`) holds: one WebGL layer, and the SVG reads without it.

```
src/gl3.js      the engine (three.js r0.186.1): materials, geometry, studio, shadows, occlusion, output
build-gl3.sh    bundles it to optimal-gl3.js (one classic script, global OptimalGL3) and writes chunk.json
optimal-gl3.js  the built chunk, committed. Copied next to each embed script; loaded lazily
host.js         page side: gl3Attach(). Inlined into each figure's page and embed
gl3.css         the canvas, and the SVG as ink
wire.mjs        build side: gl3Wire() hands a figure's build the four things above
```

After editing `src/gl3.js`: `bash shared/gl3/build-gl3.sh`, bump `version` in `src/gl3.js` and `GL3_VERSION` in
`host.js` together when the API changes, rebuild every figure that uses it, commit `optimal-gl3.js` + `chunk.json`.

## Adopting it in a figure (Fig 5, `figures/05-vo2max`, is the worked example)

**build.mjs**

```js
import { gl3Wire } from "../../shared/gl3/wire.mjs";
const GL3W = gl3Wire();
// after every solid is drawn:
const GL3 = { ...F.gl3Scene({ ground: 0, materials: [["^stand\\.", "graphite"], ["^frame\\.", "forest"]] }), ...GL3W.chunk };
const DATA = { gl3: GL3, P, W, H, ... };
const SCRIPT = `${GL3W.host}\n...`;          // host.js before the figure's own code
const CSS = `...figure css...${GL3W.css}`;   // gl3.css last
GL3W.copyTo(join(HERE, "embed"));            // after the embed script is written
```

`shared/figkit.mjs` records a solid for every `box`, `cyl`, `turned`, `pin`, `prism`, `ball`, `cable` and `bench`
call, under the solid's own name and its `piece` (the mover). `F.gl3Scene()` gives each a material: `materials` is a
list of `[pattern, preset]`, first match on the name wins, default `shell`. Anything the figure draws without those
helpers (a kit call made directly, an SVG path) has no solid: add one with
`F.glNote(glPart.prism | lathe | ball | tube | panel (...), piece)`, or it shows as a hole in the render.
`F.glFigure("as", AS.gl, materialOf)` records the standing assessor. `skip` (a RegExp) leaves solids out.

**live.js**

```js
const gl = gl3Attach(fig, { scene: DATA.gl3, P, W: DATA.W, H: DATA.H, file: DATA.gl3.file, v: DATA.gl3.v, redraw: () => render(0) });
// every frame, after the SVG is updated:
gl.move("ram", [0, 0, dz]);           // every solid recorded with piece "ram", moved rigidly (world units, cm)
gl.set("dial.needle", { F });         // a named part's frame { o, a, u, v }; scaled vectors stretch the part
gl.set("lamp", { emissive: 0xd8663c, intensity: 2 });   // also: visible, m (preset), color, opacity
gl.figure("rider", parts, materialOf) // a mannequin's parts (shared/mannequin-view.js does this when given { gl, key })
gl.render();                          // once, last
```

Every call is a no-op until the chunk has loaded, so the figure never waits on it. `redraw` is called once when
the layer arrives (and if it is lost): push the current state and render. `gl.add(desc)` adds a part after mount.

## Drag to turn (Figs 3 to 6)

`F.gl3Scene({ turn: true, ... })` in the build and `turn: DATA.gl3.turn` in `gl3Attach` put the machine on a
turntable. A drag on the stage spins it about its upright axis under the same lights (a mouse or pen drag up and down
also raises and drops the camera); a touch drag turns only sideways, so the page still scrolls under a thumb. A small
handle in the stage's corner does the same and takes the arrow keys (it shows once a pointer is about, so never on a
wall screen). Let go and the object coasts, rests about a second, and swings back.

The drawing was made for one view, so while the object is turned the SVG steps aside (`data-gl3-turn` on the stage)
and the render stands alone: paper panels stop being paper (a part named `…screen…` goes dark glass, any other goes a
plain white card), labels and drawn-only marks are gone, and everything returns when the object is home. So anything
that should survive the turn has to be a rendered part, not ink.

- `turn: { stage: false, at: "tr" }`: the stage keeps its own drag (a figure whose stage is a slider); only the
  handle turns the model. `at` is the handle's corner (`tl` default, `tr`, `bl`, `br`).
- A page or host switches it off with `?turn=off` or `turn="off"` on the element.
- The engine pulls the camera back just enough to keep the turned object in the picture, and lights the whole
  volume the object sweeps. `stage.__gl3Turn.hold(yaw, tilt)` holds a pose for QA (radians; `hold(0, 0)` is home).
- A figure whose stage already means something to a click keeps working: the click that ends a drag is swallowed.

## Glow

Lit parts bleed light: a glow pass draws only what is lit, behind the solids' own depth, blurs it at two widths and
adds it before the tone curve (a halo of the light's own colour where it falls off the object). It costs nothing on
a frame with nothing lit, and is off at the lowest quality level.

- A part is lit when its `emissive` colour times `intensity` reaches about 0.5 (`gl.set("lamp", { emissive, intensity })`).
  Fainter emissive, and anything with an emissive map, is left alone: tissue scenes use it to keep colour alive at
  night, and that is not a lamp.
- An unlit part (a laser line on a `paper` panel) glows in its own colour with `gl.set(name, { color, glow: 4 })`.
  Hair-thin parts need a high number to show a halo. In a figure's own scene code: `mesh.userData.glow = 2`, or
  `{ color, intensity }`, or `false` to keep a mesh out.
- `look.glow` scales the whole pass for one figure (`0` switches it off).
- A halo that must read from every side: a ball part with `side: "back"` (only its far half is drawn, so whatever
  sits inside it stands in a disc of light whichever way the model is turned). Fig 4's knee load is the example.

## A figure with its own 3-D scene (tissue, organs, anything the helpers don't record)

`gl3Attach(fig, { ..., build })` takes figure-specific scene code. It runs once when the layer arrives, on the same
root, lights, shadows and passes as everything else:

```js
const gl = gl3Attach(fig, {
  scene: DATA.gl3,                      // may hold no parts: { parts: [], ground: 0, bounds: [[x0,y0,z0],[x1,y1,z1]], ...chunk }
  P, W: DATA.W, H: DATA.H, file: DATA.gl3.file, v: DATA.gl3.v,
  redraw: () => render(0),
  build({ THREE, root, material, add, ghost, night, coarse }) {
    // root: a Group in the kit's own coordinates (cm or the figure's unit, z up). Add any three.js object.
    const cell = new THREE.Mesh(new THREE.SphereGeometry(4, 48, 32), material("tissue"));
    cell.castShadow = cell.receiveShadow = true;
    root.add(cell);
    ghost(membraneMesh);                // see-through meshes: kept out of the shadow and occlusion passes
    return { update(state) { cell.position.z = state.lift; }, dispose() {} };
  },
});
// every frame: gl.update(state); gl.render();
```

`THREE` here is a chosen set of three.js classes (geometry, curves, materials, math, InstancedMesh, CanvasTexture):
no loaders, so the chunk still holds no network or storage API (the build audits this). `material(name)` returns a
shared preset; clone it before changing it. Tissue presets: `tissue`, `mucosa`, `muscle`, `fat`, `cartilage`,
`marrow`, `artery`, `vein`, `nerve`, `redcell`, `membrane`, `cytoplasm`, plus `bone`.

The figure's drawn art that the 3-D scene replaces gets `data-gl3-hide` (it shows again whenever the layer is off);
labels, tracers, charts and hit targets stay in the SVG on top. `gl.view(x, y, w, h)` follows a changed viewBox.
Such a figure usually wants its SVG drawn normally over the render, not multiplied, and no Cream island in Forest
night: pass `island: false` to `gl3Attach` and set `mix-blend-mode: normal` on its SVG in the figure's CSS, e.g.
`.<figure-class> .iso-stage[data-gl3="on"] > svg { mix-blend-mode: normal }` (more specific than gl3.css).

## What to check on every figure

1. **Nothing missing.** With the layer on, every solid of the drawing must have a rendered body. Compare the page
   with `?gl=off`. A solid with no body shows the page through its outline.
2. **Movers move.** Everything that moves in the SVG moves the same way in the render: scrub, play, every button.
3. **Screens and labels.** A surface the SVG draws on in colour (a display, a chart) needs a `paper` panel under it
   (`glPart.panel`), or its colours multiply with the shaded surface. Ink lines on a white or pale body need nothing.
4. **Drawn-only parts.** A small moving marker the layer has no solid for can stay as drawn: wrap it in an element
   with `data-gl3-keep`. A drawn shadow or highlight the render now makes: `data-gl3-hide`.
5. **Both themes, phones first.** `node scripts/verify.mjs <dir>` (390 / 360 / 320, both themes, reduced motion,
   desktop; the line check runs with `?gl=off`). The stage must end at `data-gl3="on"` with a clean console.
6. **Debug views.** `?gl3debug=ao` shows the occlusion alone, `?gl3debug=normal` the normals.

## Materials

`shell` warm white plastic · `satin` pale grey-green · `bone` · `sage` · `forest` paint · `slate` · `graphite` ·
`rubber` · `steel` polished · `nickel` satin · `alu` · `brass` · `copper` · `wood` maple · `woodDark` ·
`silicone` · `glass` · `smoke` · `fluid` · `water` · `blood` · `leaf` · `heat` · `cool` · `red` · `green` ·
`blue` · `paper` (unlit white: the SVG shows on it exactly as drawn).

The colourway is the brand's, not a maker's: white shells, forest or sage paint, graphite and rubber where hands
and feet go, brushed metal for shafts, maple mannequins with satin nickel joints. See-through presets (`glass`,
`smoke`, `fluid`, `water`) cast no shadow and take no part in the occlusion pass.

`look` in `gl3Scene({ look })` tunes one figure: `exposure`, `env`, `ao`, `cast`, `contact`, `pool`, `glow`
(multipliers), `aoRadius`, `contactHeight` (cm).

`screenOff` (dark glass) and `card` (plain white) are what `paper` turns into while a machine is turned.

## How the picture is made

- **Camera.** The kit's projection exactly: `x = ox + (p·r)k`, `y = oy − (p·u)k`. The kit's world is left-handed,
  and three.js drops a mirror from a camera, so the camera is a plain rotation and the scene hangs under one group
  that mirrors it. `project(p)` on the layer returns SVG pixels for a world point (QA: equals the kit's `iso()`).
- **Light.** A baked studio (key overhead-left, a strip at the left, fill, rim) plus one key light with a shadow
  map for solids shading each other.
- **Floor.** No floor is drawn. One see-through plane carries two shadows: the silhouette the key light sees,
  blurred wide, and a contact layer (the scene seen from the floor looking up, nearer = darker). Both fade to
  nothing before the canvas edge, so the canvas never shows as a box.
- **Occlusion.** GTAO on the solids, blended into the picture; then one output pass (tone curve, sRGB, dither).
- **Shadows between solids.** One shadow map from the key light, fitted to the scene's box as the light sees it (so every
  texel lands on the figure) and drawn once a frame, however many passes the frame has. `look.shadowBlur` sets the
  soft edge in cm (default 2.4).
- **Sharpness.** Multisampled, and on a 1x screen (a desktop monitor, the clinic TV) drawn at 1.5x and scaled down.
- **Glow.** Lit parts alone, drawn at half size behind the solids' depth, blurred at two widths, added in the output
  pass. See Glow above.
- **Turntable.** `turn(yaw, tilt)` spins the scene's root about an upright axis through the middle of its box and
  changes the camera's elevation; lights, floor and studio stay put, so shadows and reflections move as they would.
- **Counts.** `stage.__gl3.stats()` gives draw calls and triangles for the last frame, all passes together.
- **Pace.** The figure owns the clock and calls `render()`. If frames run long while it animates, `host.js` steps
  the layer's quality down (lighter occlusion, then none and a lower pixel ratio). It never steps up.
