const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/scrape', async (req, res) => {
    const asin = req.query.asin;
    const mapPrice = req.query.mapPrice;

    const data = await scrapeAmazon(asin);
    res.json(data);
});

async function scrapeAmazon(asin) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = `https://www.amazon.com/dp/${asin}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate((asin) => {
        const getPrice = () => {
            let wholePriceElement = document.querySelector('span.a-price-whole');
            let fractionalPriceElement = document.querySelector('span.a-price-fraction');
            if (wholePriceElement && fractionalPriceElement) {
                return wholePriceElement.innerText.replace(/[^\d]/g, '') + '.' + fractionalPriceElement.innerText.replace(/[^\d]/g, '');
            } else if (wholePriceElement) {
                return wholePriceElement.innerText.replace(/[^\d]/g, '') + '.00';
            } else {
                return null;
            }
        };

        const getVendor = () => {
            let vendorElement = document.querySelector('#sellerProfileTriggerId');
            if (vendorElement) {
                return vendorElement.innerText.trim();
            }

            let fallbackVendorElement = document.querySelector('#merchant-info');
            if (fallbackVendorElement) {
                let vendorText = fallbackVendorElement.innerText.trim();
                let match = vendorText.match(/Sold by\s+(.*?)\s+and/);
                if (match) {
                    return match[1].trim();
                }
                match = vendorText.match(/Sold by\s+(.*)/);
                if (match) {
                    return match[1].trim();
                }
            }

            return null;
        };

        return {
            price: getPrice(),
            vendor: getVendor(),
            url: window.location.href,
            asin: asin
        };
    }, asin);

    const otherSellersLink = await page.$('a[href*="/gp/offer-listing"], a[href*="/gp/offer-listing"] span');
    if (otherSellersLink) {
        console.log('Other sellers link found, clicking...');
        await otherSellersLink.click();
        await page.waitForSelector('#aod-offer', { waitUntil: 'networkidle2' });

        const otherSellers = await page.evaluate(() => {
            const sellers = [];
            const rows = document.querySelectorAll('#aod-offer');

            rows.forEach(row => {
                const sellerElement = row.querySelector('#aod-offer-soldBy a');
                const priceElementWhole = row.querySelector('#aod-offer-price .a-price-whole');
                const priceElementFraction = row.querySelector('#aod-offer-price .a-price-fraction');

                let seller = sellerElement ? sellerElement.innerText.trim() : 'Unknown';
                let price = null;

                if (priceElementWhole && priceElementFraction) {
                    price = priceElementWhole.innerText.replace(/[^\d]/g, '') + '.' + priceElementFraction.innerText.replace(/[^\d]/g, '');
                } else if (priceElementWhole) {
                    price = priceElementWhole.innerText.replace(/[^\d]/g, '') + '.00';
                }

                if (seller && price) {
                    sellers.push({ seller, price });
                }
            });

            return sellers;
        });

        result.otherSellers = otherSellers;
    }

    await browser.close();
    return result;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
