// QA for the interactive figure page (phone-first rule of the public anatomy gallery).
// Touch emulation at 390 / 360 / 320 px plus desktop, both themes:
//   no horizontal scroll · touch hint copy under (hover: none) · 44 px buttons · tap toggles take-apart ·
//   drag turns without toggling · every button works and reports its state · desktop hover + keyboard still work.
// usage: node tools/qa-figure.mjs [outdir]   (screenshots land in outdir, default out/qa-figure)
import { launch } from "../scripts/browser.mjs";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(process.argv[2] ?? join(ROOT, "out", "qa-figure"));
mkdirSync(OUT, { recursive: true });
const PAGES = { light: join(ROOT, "object", "figure-light.html"), dark: join(ROOT, "object", "figure.html") };
const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const shots = [];
const expect = (ok, label) => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${label}`);
  return ok;
};
const browser = await launch();

async function open(theme, { width, height, touch, reduced = true }) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => results.push(`FAIL  pageerror ${e.message}`));
  if (touch) await page.emulate({ userAgent: UA, viewport: { width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true } });
  else await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
  await page.goto(pathToFileURL(PAGES[theme]).href);
  await page.waitForFunction(() => window.__anatomy);
  await page.evaluate(() => document.fonts.ready);
  await sleep(300);
  return page;
}
const state = (page) =>
  page.evaluate(() => {
    const t = window.__anatomy.target;
    const b = (a) => document.querySelector(`.ar-btn[data-act="${a}"]`);
    return {
      apart: t.apart,
      grip: t.grip,
      screen: t.screen,
      scan: t.scan,
      yaw: t.yaw,
      apartLabel: b("apart").textContent,
      gripPressed: b("grip").getAttribute("aria-pressed"),
      screenPressed: b("screen").getAttribute("aria-pressed"),
      scanLabel: b("scan").textContent,
    };
  });
const centre = (page, sel) =>
  page.evaluate((sel) => {
    const r = document.querySelector(sel).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, top: r.top };
  }, sel);
async function shot(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  shots.push(path);
}
async function tapButton(page, act) {
  await page.evaluate((a) => document.querySelector(`.ar-btn[data-act="${a}"]`).scrollIntoView({ block: "center" }), act);
  await sleep(150);
  const c = await centre(page, `.ar-btn[data-act="${act}"]`);
  await page.touchscreen.tap(c.x, c.y);
  await sleep(250);
}

for (const width of [390, 360, 320]) {
  for (const theme of width === 390 ? ["light", "dark"] : ["light"]) {
    const tag = `${width}-${theme}`;
    const page = await open(theme, { width, height: 844, touch: true });
    const m = await page.evaluate(() => ({
      hoverNone: matchMedia("(hover: none)").matches,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      bodyW: document.body.scrollWidth,
      touchHint: getComputedStyle(document.querySelector(".ar-hint-touch")).display,
      hoverHint: getComputedStyle(document.querySelector(".ar-hint-hover")).display,
      hintText: [...document.querySelectorAll('[data-corner="hint"] span')].filter((s) => getComputedStyle(s).display !== "none").map((s) => s.textContent).join(""),
      intro: document.querySelector(".ar-sub").innerText,
      buttons: [...document.querySelectorAll(".ar-btn")].map((b) => {
        const r = b.getBoundingClientRect();
        return { text: b.textContent, h: Math.round(r.height), w: Math.round(r.width), right: Math.round(r.right) };
      }),
      overflow: [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 0.5 && getComputedStyle(el).position !== "fixed").map((el) => el.className || el.tagName).slice(0, 5),
    }));
    expect(m.hoverNone, `${tag}: (hover: none) matches under touch emulation`);
    expect(m.scrollW <= m.innerW && m.bodyW <= m.innerW, `${tag}: no horizontal scroll (scrollWidth ${m.scrollW}, viewport ${m.innerW})`);
    expect(!m.overflow.length, `${tag}: no element past the right edge${m.overflow.length ? ` (${m.overflow.join(", ")})` : ""}`);
    expect(m.hintText === "Drag to turn · tap to take apart", `${tag}: hint reads "${m.hintText}"`);
    expect(!/hover|press A/.test(m.intro) && /tap it/.test(m.intro), `${tag}: intro copy is touch copy ("${m.intro.slice(-66)}")`);
    expect(m.buttons.every((b) => b.h >= 44), `${tag}: buttons ≥ 44 px tall (${m.buttons.map((b) => `${b.text} ${b.w}×${b.h}`).join(", ")})`);
    await shot(page, `${tag}-0-start`);

    // tap the figure: takes it apart, tap again: puts it together
    await page.evaluate(() => document.querySelector(".ar-stage").scrollIntoView({ block: "center" }));
    await sleep(200);
    let c = await centre(page, ".ar-stage");
    await page.touchscreen.tap(c.x, c.y);
    await sleep(900);
    let s = await state(page);
    expect(s.apart === 1 && s.apartLabel === "Put together", `${tag}: tap on the figure takes it apart (apart ${s.apart}, button "${s.apartLabel}")`);
    await shot(page, `${tag}-1-tapped-apart`);
    await page.touchscreen.tap(c.x, c.y);
    await sleep(300);
    s = await state(page);
    expect(s.apart === 0 && s.apartLabel === "Take apart", `${tag}: second tap puts it together (apart ${s.apart})`);

    // drag: turns, does not toggle
    const yaw0 = s.yaw;
    await page.touchscreen.touchStart(c.x - 60, c.y);
    for (let i = 1; i <= 8; i++) {
      await page.touchscreen.touchMove(c.x - 60 + i * 15, c.y + i);
      await sleep(16);
    }
    await page.touchscreen.touchEnd();
    await sleep(300);
    s = await state(page);
    expect(Math.abs(s.yaw - yaw0) > 20 && s.apart === 0, `${tag}: horizontal drag turns it (yaw ${yaw0.toFixed(0)}° → ${s.yaw.toFixed(0)}°) without taking it apart`);

    // buttons
    await tapButton(page, "apart");
    s = await state(page);
    expect(s.apart === 1 && s.apartLabel === "Put together", `${tag}: "Take apart" button → apart, label "${s.apartLabel}"`);
    await tapButton(page, "apart");
    s = await state(page);
    expect(s.apart === 0 && s.apartLabel === "Take apart", `${tag}: "Put together" button → together`);
    await tapButton(page, "grip");
    s = await state(page);
    expect(s.grip === 1 && s.gripPressed === "true", `${tag}: "Lift grips" → grips held, aria-pressed ${s.gripPressed}`);
    await tapButton(page, "screen");
    s = await state(page);
    expect(s.screen === 1 && s.screenPressed === "true", `${tag}: "Screen on" → screen on, aria-pressed ${s.screenPressed}`);
    await tapButton(page, "grip");
    await tapButton(page, "screen");
    s = await state(page);
    expect(s.grip === 0 && s.screen === 0 && s.gripPressed === "false" && s.screenPressed === "false", `${tag}: both toggles release (aria-pressed false)`);
    await tapButton(page, "scan");
    await sleep(1300);
    s = await state(page);
    expect(s.scanLabel === "Measuring…" && s.grip === 1 && s.screen === 1, `${tag}: "Measure" runs (label "${s.scanLabel}", grips ${s.grip}, screen ${s.screen})`);
    await page.evaluate(() => document.querySelector(".ar-stage").scrollIntoView({ block: "start" }));
    await sleep(200);
    await shot(page, `${tag}-2-measuring`);
    await sleep(2600);
    s = await state(page);
    expect(s.scanLabel === "Measure" && s.scan === 1, `${tag}: measurement completes, button back to "${s.scanLabel}"`);
    await page.close();
  }
}

// desktop: hover takes apart, mouse buttons and keys work, hint keeps the keyboard copy
for (const theme of ["light", "dark"]) {
  const tag = `desktop-${theme}`;
  const page = await open(theme, { width: 1280, height: 900, touch: false });
  const m = await page.evaluate(() => ({
    hover: matchMedia("(hover: hover)").matches,
    hintText: [...document.querySelectorAll('[data-corner="hint"] span')].filter((s) => getComputedStyle(s).display !== "none").map((s) => s.textContent).join(""),
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
  }));
  expect(m.hover && m.hintText.startsWith("Drag to turn · hover to take apart"), `${tag}: hover device keeps "${m.hintText}"`);
  expect(m.scrollW <= m.innerW, `${tag}: no horizontal scroll`);
  const c = await centre(page, ".ar-stage");
  await page.evaluate(() => document.querySelector(".ar-stage").scrollIntoView({ block: "center" }));
  await sleep(200);
  const c2 = await centre(page, ".ar-stage");
  await page.mouse.move(c2.x, c2.y);
  await sleep(400);
  let s = await state(page);
  expect(s.apart === 1, `${tag}: hover takes it apart`);
  await page.mouse.move(5, 5);
  await sleep(300);
  s = await state(page);
  expect(s.apart === 0, `${tag}: leaving puts it together`);
  for (const act of ["grip", "screen"]) {
    const b = await centre(page, `.ar-btn[data-act="${act}"]`);
    await page.mouse.click(b.x, b.y);
    await sleep(200);
  }
  s = await state(page);
  expect(s.grip === 1 && s.screen === 1 && s.gripPressed === "true" && s.screenPressed === "true", `${tag}: mouse clicks on "Lift grips" and "Screen on" work`);
  await page.focus(".ar-stage");
  await page.keyboard.press("a");
  await sleep(700);
  s = await state(page);
  expect(s.apart === 1 && s.apartLabel === "Put together", `${tag}: key A takes it apart and updates the button`);
  await page.mouse.move(c2.x, c2.y);
  await sleep(200);
  await page.mouse.move(5, 5);
  await sleep(300);
  s = await state(page);
  expect(s.apart === 1, `${tag}: after an explicit choice, hover no longer overrides it`);
  void c;
  await shot(page, `${tag}`);
  await page.close();
}
await browser.close();
console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("PASS")).length} pass · ${results.filter((r) => r.startsWith("FAIL")).length} fail`);
console.log("screenshots:\n" + shots.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
