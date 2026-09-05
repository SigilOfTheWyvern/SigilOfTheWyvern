import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const out = join(process.cwd(), ".verify");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const pages = [
  ["home", "/"],
  ["music", "/music"],
  ["tour", "/tour"],
  ["store", "/store"],
  ["media", "/media"],
  ["band", "/band"],
  ["contact", "/contact"],
];

for (const [name, path] of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle" });
  const nav = await page.locator('nav[aria-label="Primary"] a').allTextContents();
  const title = await page.title();
  const h1 = await page.locator("h1").first().innerText();
  await page.screenshot({ path: join(out, `${name}.png`) });
  console.log(JSON.stringify({ name, title, h1, nav }));
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/store/blood-sigil-tee", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Add to bag" }).click();
const bagText = await page.locator("aside").innerText();
await page.screenshot({ path: join(out, "bag.png") });
console.log("bag", bagText.slice(0, 180));
await page.close();

await browser.close();
