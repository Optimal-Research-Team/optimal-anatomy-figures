// Full-page screenshot of a figure page (checks header, plate, legend and spec list)
import { launch } from "../scripts/browser.mjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const [file, out, width = "820"] = process.argv.slice(2);
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: 900, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("pageerror:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(pathToFileURL(resolve(file)).href);
await page.waitForFunction(() => window.__anatomy);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.__anatomy.set({ yaw: -36, pitch: 15, grip: 1, screen: 1, scan: 1 }));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
