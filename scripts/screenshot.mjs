import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const out = join(process.cwd(), ".verify");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

async function shoot(name, viewport, extra) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  if (extra) await extra(page);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: name.includes("full") });
  await page.close();
  return errors;
}

const desktopErrors = await shoot("desktop-hero", { width: 1440, height: 900 });
const desktopFull = await shoot("desktop-full", { width: 1440, height: 900 });
const mobileHero = await shoot("mobile-hero", { width: 390, height: 844 });
const mobileMenu = await shoot("mobile-menu", { width: 390, height: 844 }, async (page) => {
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(200);
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.locator("#tour").scrollIntoViewIfNeeded();
await page.screenshot({ path: join(out, "desktop-tour.png") });
await page.locator("#merch").scrollIntoViewIfNeeded();
await page.screenshot({ path: join(out, "desktop-merch.png") });
await page.locator("#contact").scrollIntoViewIfNeeded();
await page.screenshot({ path: join(out, "desktop-contact.png") });
await page.getByPlaceholder("Your email").fill("not-an-email");
await page.getByRole("button", { name: /enter the mark/i }).click();
await page.screenshot({ path: join(out, "contact-error.png") });
await page.getByPlaceholder("Your email").fill("rite@sigilofthewyvern.com");
await page.getByRole("button", { name: /enter the mark/i }).click();
await page.screenshot({ path: join(out, "contact-success.png") });
await page.goto("http://localhost:3000/does-not-exist", { waitUntil: "networkidle" });
await page.screenshot({ path: join(out, "not-found.png") });
await page.close();

await browser.close();
console.log({ desktopErrors, desktopFull, mobileHero, mobileMenu });
