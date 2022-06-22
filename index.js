const { chromium } = require("playwright");
const axios = require('axios');
const fs = require("fs");

// Main func run Playwright ...
(async () => {
    try {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ "width": 880, "height": 1000 });
        await page.setDefaultTimeout(50000);

        // Scraping data from app.hector.finance
        console.log('==>Scraping data from app.hector.finance');
        console.log('==>goto app.hector.finance');

        await page.goto('https://app.hector.finance', { waitUntil: 'networkidle' });

        // Closing app
        await browser.close();
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})();
