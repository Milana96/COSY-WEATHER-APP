import { chromium } from "playwright";

const url = process.env.APP_URL || "http://127.0.0.1:3000";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);

    const searchInput = page.getByLabel("Find city");
    const searchButton = page.locator('form.search-form button[type="submit"]');

    await searchInput.waitFor({ state: "visible", timeout: 30000 });
    await searchInput.fill("");
    await searchInput.fill("New York");
    await searchButton.click();

    await page.waitForFunction(
      () => document.body.innerText.includes("New York"),
      { timeout: 40000 },
    );
    await page.waitForTimeout(8000);

    const weatherVisible = await page
      .locator("text=/New York|°C|°F|Cloudy|Sunny|Rain|Clear/i")
      .first()
      .isVisible()
      .catch(() => false);
    const cardVisible = await page
      .locator("text=/Current weather|Feels like|Humidity|Wind/i")
      .first()
      .isVisible()
      .catch(() => false);

    await page.screenshot({
      path: "tests/artifacts/search-test-success.png",
      fullPage: true,
    });

    console.log(
      JSON.stringify(
        {
          url,
          weatherVisible,
          cardVisible,
          inputSelector: 'form.search-form input[id="city"]',
          buttonSelector: 'form.search-form button[type="submit"]',
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})();
