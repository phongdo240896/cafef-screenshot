const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 4000 });

  await page.goto("https://iboard.ssi.com.vn", { waitUntil: "networkidle2", timeout: 60000 });

  // Đợi trang tải dữ liệu xong
  await page.waitForTimeout(8000);

  const screenshotBuffer = await page.screenshot({ fullPage: true });

  await axios.post("https://tenmiencuaphong.com/upload-image.php", screenshotBuffer, {
    headers: { "Content-Type": "application/octet-stream" }
  });

  await browser.close();
})();
