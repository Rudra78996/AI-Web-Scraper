import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scraper(url) {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (await import("puppeteer")).executablePath(),
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-features=IsolateOrigins,site-per-process"
            ]
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

        await page.goto(url, { waitUntil: "networkidle2" });

        await page.waitForFunction(() => document.readyState === "complete");

        const pageText = await page.evaluate(() => document.body.innerText);

        await browser.close();
        console.log("Scraping completed successfully.");
        return pageText;

    } catch (error) {
        console.error("Error scraping website:", error);
        return null;
    }
}

export default scraper;
