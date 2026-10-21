// Checks the anatomy page on touch phones (390 / 360 / 320 px) and desktop: no horizontal scroll, tap toggles
// take-apart, a touch drag turns it, every control button works and is at least 44 px tall. Saves screenshots.
import { launch } from "./browser.mjs";
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";
const OUT = resolve(process.argv[2] ?? "out/page-shots");
const pageFor = (theme) => pathToFileURL(resolve(`object/figure${theme === "light" ? "-light" : ""}.html`)).href;
const browser = await launch();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "pass" : "FAIL"}  ${msg}`);
  if (!ok) failures++;
};
async function open(theme, viewport) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => check(false, `page error: ${e.message}`));
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(pageFor(theme));
  await page.waitForFunction(() => window.__anatomy);
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const state = (page) => page.evaluate(() => ({ ...window.__anatomy.target, drawnPeak: window.__anatomy.drawn.peak }));
const btn = (page, act) => page.$(`[data-act="${act}"]`);
const attr = (page, act, a) => page.$eval(`[data-act="${act}"]`, (b, x) => (x === "text" ? b.textContent : b.getAttribute(x)), a);
for (const width of [390, 360, 320]) {
  const tag = `${width} touch`;
  const page = await open("light", { width, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const env = await page.evaluate(() => ({
    hoverNone: matchMedia("(hover: none)").matches,
    scroll: document.documentElement.scrollWidth,
    inner: window.innerWidth,
    hint: [...document.querySelectorAll("[data-corner=hint] span")].filter((s) => getComputedStyle(s).display !== "none").map((s) => s.textContent).join(""),
    heights: [...document.querySelectorAll(".ar-btn")].map((b) => Math.round(b.getBoundingClientRect().height)),
  }));
  check(env.hoverNone, `${tag}: (hover: none) matches`);
  check(env.scroll <= env.inner, `${tag}: no horizontal scroll (${env.scroll} <= ${env.inner})`);
  check(env.hint === "Drag to turn · tap to take apart", `${tag}: hint reads "${env.hint}"`);
  check(env.heights.length === 4 && env.heights.every((h) => h >= 44), `${tag}: 4 buttons, heights ${env.heights.join("/")} px`);
  await page.screenshot({ path: join(OUT, `phone-${width}-light.png`), fullPage: true });
  const stage = await page.$(".ar-stage");
  const box = await stage.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await stage.scrollIntoView();
  const b2 = await stage.boundingBox();
  const sx = b2.x + b2.width / 2;
  const sy = b2.y + b2.height / 2;
  void cx; void cy;
  // tap toggles
  await page.touchscreen.tap(sx, sy);
  await wait(150);
  let s = await state(page);
  check(s.apart === 1, `${tag}: tap takes it apart (apart=${s.apart})`);
  check((await attr(page, "apart", "aria-pressed")) === "true" && (await attr(page, "apart", "text")) === "Put together", `${tag}: button shows "Put together", aria-pressed=true`);
  if (width === 390) {
    await wait(900);
    await page.screenshot({ path: join(OUT, `phone-390-light-apart.png`), fullPage: false, clip: { x: 0, y: Math.max(0, b2.y - 20), width, height: 760 } });
  }
  await page.touchscreen.tap(sx, sy);
  await wait(150);
  s = await state(page);
  check(s.apart === 0, `${tag}: second tap puts it together (apart=${s.apart})`);
  // drag turns, does not toggle
  const yaw0 = s.yaw;
  await page.touchscreen.touchStart(sx, sy);
  for (let i = 1; i <= 8; i++) {
    await page.touchscreen.touchMove(sx + i * 12, sy + i * 2);
    await wait(30);
  }
  await page.touchscreen.touchEnd();
  await wait(150);
  s = await state(page);
  check(Math.abs(s.yaw - yaw0) > 30 && s.apart === 0, `${tag}: drag turns it (yaw ${yaw0.toFixed(0)} -> ${s.yaw.toFixed(0)}) without taking it apart`);
  // buttons
  await (await btn(page, "apart")).tap();
  await wait(100);
  s = await state(page);
  check(s.apart === 1 && (await attr(page, "apart", "aria-pressed")) === "true", `${tag}: "Take apart" button takes it apart`);
  await (await btn(page, "apart")).tap();
  await wait(100);
  s = await state(page);
  check(s.apart === 0 && (await attr(page, "apart", "text")) === "Take apart", `${tag}: "Put together" puts it back`);
  await (await btn(page, "squeeze")).tap();
  await wait(1400);
  s = await state(page);
  check(s.grip === 42 && (await attr(page, "squeeze", "aria-pressed")) === "true" && s.drawnPeak > 40, `${tag}: "Squeeze" squeezes (grip ${s.grip} kg, peak drawn ${s.drawnPeak.toFixed(1)})`);
  if (width === 390) await page.screenshot({ path: join(OUT, `phone-390-light-squeeze.png`), clip: { x: 0, y: Math.max(0, b2.y - 20), width, height: 760 } });
  await (await btn(page, "squeeze")).tap();
  await wait(1400);
  s = await state(page);
  check(s.grip === 0 && s.peak > 40 && (await attr(page, "squeeze", "aria-pressed")) === "false", `${tag}: release: grip 0, peak holds ${s.peak.toFixed(1)} kg`);
  await (await btn(page, "reset")).tap();
  await wait(2500); // the needle eases back exponentially
  s = await state(page);
  check(s.peak === 0 && s.drawnPeak < 0.5, `${tag}: "Reset peak" returns the peak needle to 0 (drawn ${s.drawnPeak.toFixed(2)})`);
  await (await btn(page, "handle")).tap();
  await wait(100);
  s = await state(page);
  check(s.position === 3 && (await attr(page, "handle", "aria-label")) === "Handle position, now 3 of 5", `${tag}: "Handle position" steps to ${s.position}`);
  await page.close();
}
{
  const page = await open("dark", { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const sc = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  check(sc[0] <= sc[1], `390 touch dark: no horizontal scroll (${sc[0]} <= ${sc[1]})`);
  await page.screenshot({ path: join(OUT, `phone-390-dark.png`), fullPage: true });
  await page.close();
}
for (const theme of ["light", "dark"]) {
  const tag = `desktop 1280 ${theme}`;
  const page = await open(theme, { width: 1280, height: 900, deviceScaleFactor: 1 });
  const env = await page.evaluate(() => ({
    hover: matchMedia("(hover: hover)").matches,
    scroll: document.documentElement.scrollWidth,
    inner: innerWidth,
    hint: [...document.querySelectorAll("[data-corner=hint] span")].filter((s) => getComputedStyle(s).display !== "none").map((s) => s.textContent).join(""),
    heights: [...document.querySelectorAll(".ar-btn")].map((b) => Math.round(b.getBoundingClientRect().height)),
    rowTops: [...new Set([...document.querySelectorAll(".ar-btn")].map((b) => Math.round(b.getBoundingClientRect().top)))].length,
  }));
  check(env.hover && env.scroll <= env.inner, `${tag}: hover device, no horizontal scroll`);
  check(env.hint.startsWith("Drag to turn · hover to take apart"), `${tag}: hint reads "${env.hint}"`);
  check(env.heights.every((h) => h >= 44) && env.rowTops === 1, `${tag}: buttons ${env.heights.join("/")} px in one row`);
  await page.screenshot({ path: join(OUT, `desktop-1280-${theme}.png`), fullPage: true });
  if (theme === "light") {
    const stage = await page.$(".ar-stage");
    const b = await stage.boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await wait(150);
    let s = await state(page);
    check(s.apart === 1, `${tag}: hover previews take-apart`);
    await page.mouse.move(5, 5);
    await wait(150);
    s = await state(page);
    check(s.apart === 0, `${tag}: leaving restores it`);
    await (await btn(page, "apart")).click();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.move(5, 5);
    await wait(150);
    s = await state(page);
    check(s.apart === 1, `${tag}: button pins take-apart through a hover in and out`);
    await page.keyboard.press("Tab");
    await page.focus(".ar-stage");
    await page.keyboard.press("g");
    await wait(100);
    s = await state(page);
    check(s.grip === 42 && (await attr(page, "squeeze", "aria-pressed")) === "true", `${tag}: G key squeezes and the Squeeze button follows`);
    await wait(1200);
    await page.screenshot({ path: join(OUT, `desktop-1280-light-apart-squeeze.png`), fullPage: false });
  }
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} check(s) failed` : "all page checks passed");
process.exit(failures ? 1 : 0);
