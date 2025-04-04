const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // bắt buộc với Render
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 4000 });

    await page.goto("https://iboard.ssi.com.vn", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Đợi trang load đầy đủ dữ liệu bảng
    await page.waitForTimeout(8000);

    const buffer = await page.screenshot({ fullPage: true });

    // Gửi ảnh về server PHP của anh Phong
    const uploadUrl = "https://TENMIENCUAANH.COM/upload-image.php"; // 👈 Sửa lại domain anh nhé
    const response = await axios.post(uploadUrl, buffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });

    await browser.close();
    res.send(`✅ Chụp ảnh thành công! Link ảnh: ${response.data.link}`);
  } catch (error) {
    res.status(500).send("❌ Lỗi khi chụp ảnh: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
