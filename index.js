const { chromium } = require("playwright");
const axios = require('axios');

// Get current token price from api.binance.com
const get_binance_pair_price = async (pair) => {
    const api = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    const response = await axios.get(api)

    return response.data
}

// Main func run Playwright ...
(async () => {
    try {
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ "width": 880, "height": 1000 });
        await page.setDefaultTimeout(50000);

        // Reading current token prices from api.binance.com
        const BTCUSDT = await get_binance_pair_price("BTCUSDT")
        const btcPrice = parseFloat(BTCUSDT['price']).toFixed(2)
        const FTMUSDT = await get_binance_pair_price("FTMUSDT")
        const ftmPrice = parseFloat(FTMUSDT['price']).toFixed(4)



        // Scraping data from app.hector.finance
        console.log('==>Scraping data from app.hector.finance');
        console.log('==>goto app.hector.finance');

        await page.goto('https://app.hector.finance', { waitUntil: 'networkidle' });

        console.log('   BTC Price:', '$' + btcPrice)
        console.log('   FTM Price:', '$' + ftmPrice)
        console.log('==>Scraping from app.hector.finance finished');
        console.log('');

        // Closing app
        await browser.close();
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})();
