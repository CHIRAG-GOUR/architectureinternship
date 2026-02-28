const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE ERROR: ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`RUNTIME ERROR: ${error.message}`);
    });

    page.on('requestfailed', request => {
        console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
    });

    await page.goto('http://localhost:5173/#/chapter/2.3', { waitUntil: 'networkidle0' });

    await browser.close();
})();
