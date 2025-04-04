const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 4000 });

    await page.goto("https://iboard.ssi.com.vn", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForTimeout(8000);
    const buffer = await page.screenshot({ fullPage: true });

    await axios.post("https://TENMIENCUAPHONG.com/upload-image.php", buffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });

    await browser.close();
    res.send("✅ Đã chụp và gửi ảnh thành công!");
  } catch (err) {
    res.status(500).send("❌ Lỗi: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
