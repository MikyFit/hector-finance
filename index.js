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

        // I need to create Playwright's locators to find elements on the page. I am going to select elements based on the page layout. 
        const marketCap = await page.locator('div:below(:text("Market Cap")) >> nth=0').innerText();
        const hecPrice = await page.locator('div:below(:text("Hec Price")) >> nth=0').innerText();
        const hecBurned = await page.locator('div:below(:text("Hec Burned")) >> nth=0').innerText();
        const circulatingSupply = await page.locator('div:below(:text("Circulating Supply")) >> nth=0').innerText();
        const hecTreasury = await page.locator('div:below(:text("Treasury")) >> nth=0').innerText();
        const currentIndex = await page.locator('div:below(:text("Current Index")) >> nth=0').innerText();

        const totalValueDeposited = await page.locator('div:right-of(:text("Total Value Deposited")) >> nth=0').innerText();
        const hecStaked = await page.locator('div:right-of(:text("HEC Staked")) >> nth=0').innerText();
        const hecRunway = await page.locator('div:right-of(:text("Runway")) >> nth=0').innerText();
        const protocolOwnedLiquidity = await page.locator('div:right-of(:text("Protocol Owned Liquidity")) >> nth=0').innerText();

        // Grabbing APY from app.hector.finance/stake
        await page.goto('https://app.hector.finance/stake', { waitUntil: 'networkidle' });
        // Waiting for selectors loading
        const hecApy = await page.locator('div:below(:text("APY")) >> nth=0').innerText();



        console.log('   BTC Price:', '$' + btcPrice)
        console.log('   FTM Price:', '$' + ftmPrice)

        console.log('   Market Cap:', '$' + marketCap)
        console.log('   HEC Price:', '$' + hecPrice)
        console.log('   HEC Burned:', hecBurned)
        console.log('   Circulating Supply:', circulatingSupply)
        console.log('   HEC Treasury:', '$' + hecTreasury)
        console.log('   Current Index:', currentIndex)

        console.log('   Total Value Deposited:', totalValueDeposited)
        console.log('   HEC Staked:', hecStaked)
        console.log('   HEC Runway:', hecRunway)
        console.log('   Protocol Owned Liquidity:', protocolOwnedLiquidity)

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
