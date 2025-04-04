const puppeteer = require("puppeteer");
const axios = require("axios");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 4000 });
  await page.goto("https://iboard.ssi.com.vn", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await page.waitForTimeout(8000); // đợi trang load dữ liệu
  const screenshot = await page.screenshot({ fullPage: true });

  // Gửi về server cPanel
  await axios.post("https://TENMIENCUAANH.COM/upload-image.php", screenshot, {
    headers: { "Content-Type": "application/octet-stream" },
  });

  await browser.close();
})();
