import scrapeWebsiteText from "./scraper.js";
import express from 'express';
import cors from"cors";
import chat from "./chat.js";
import dotenv from "dotenv";
dotenv.config();


const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/scrap', async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
  
    try {
      const text = await scrapeWebsiteText(url);
      res.status(200).json({ data: text });
    } catch (err) {
      console.error('Scraping error:', err);
      res.status(500).json({ error: "Failed to scrape website" });
    }
  });
  

app.post("/chat", async (req, res) => {
    const { message, scrapedData, websiteLink } = req.body;
    if (!message || !websiteLink || !scrapedData) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const data = await chat(message, scrapedData, websiteLink);
        res.status(200).json({ result: data });
    } catch (e) {
        console.error("Chat error:", e);
        res.status(500).json({ error: "Error processing chat request" });
    }
});


app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
