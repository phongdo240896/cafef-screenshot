import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.get('/screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto('https://cafef.vn/du-lieu.chn', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi chụp ảnh.');
  }
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
