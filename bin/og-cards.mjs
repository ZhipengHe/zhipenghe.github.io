// Render one Open Graph card per page from the manifest that
// _plugins/og_cards.rb writes into the built site.
//
//   node bin/og-cards.mjs [_site]
//
// Uses the Chromium bundled with @playwright/test (install it once with
// `npx playwright install chromium`) and the template in bin/og-card.html.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const siteDir = process.argv[2] ?? "_site";
const cardDir = path.join(siteDir, "assets", "img", "og");
const template = fileURLToPath(new URL("./og-card.html", import.meta.url));

const manifest = JSON.parse(await fs.readFile(path.join(cardDir, "cards.json"), "utf8"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("file://" + template);

for (const card of manifest) {
  await page.evaluate((card) => {
    const el = (id) => document.getElementById(id);
    document.getElementById("card").classList.toggle("home", card.home);
    el("title").textContent = card.title;
    el("title").classList.toggle("long", card.title.length > 40);
    el("title").classList.toggle("xlong", card.title.length > 95);
    el("cjk").hidden = !card.cjk;
    el("cjk").textContent = card.cjk ?? "";
    el("desc").textContent = card.description ?? "";
    el("desc").hidden = !card.description;
    el("meta").textContent = card.date ? `${card.section} · ${card.date}` : card.section;
  }, card);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(cardDir, `${card.slug}.png`), type: "png" });
}

await browser.close();
console.log(`Rendered ${manifest.length} Open Graph cards into ${cardDir}`);
