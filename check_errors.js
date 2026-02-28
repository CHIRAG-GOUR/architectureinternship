import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            console.log(`[${msg.type().toUpperCase()}]`, msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('[PAGE ERROR]', error.message);
    });

    console.log("Navigating to localhost:5173...");
    await page.goto('http://localhost:5173/#/chapter/2.5', { waitUntil: 'networkidle2', timeout: 10000 }).catch(e => console.log(e));

    console.log("Done.");
    await browser.close();
})();
