
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = false;

const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://iboard.ssi.com.vn", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.waitForSelector("#btnExportPriceboard", { timeout: 10000 });
    await page.click("#btnExportPriceboard");

    await page.waitForTimeout(4000); // Chờ tải về xong

    const csvContent = await page.evaluate(() => {
      return document.querySelector("body").innerText;
    });

    const fileName = "/tmp/iboard-data.csv";
    fs.writeFileSync(fileName, csvContent);

    const fileData = fs.readFileSync(fileName);
    res.setHeader("Content-Disposition", "attachment; filename=iboard-data.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(fileData);

    await browser.close();
  } catch (err) {
    res.status(500).send("❌ Lỗi: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("✅ Server đang chạy tại http://localhost:" + PORT);
});
