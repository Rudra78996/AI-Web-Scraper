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
  

app.get("/chat", async (req, res)=>{
    const {message, scrapedData, websiteLink} = req.body;
    if (!message || !websiteLink || !scrapedData) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try{
        const data = await chat(message, scrapedData, websiteLink);
        res.json({result : data}); 
    } catch(e){
        return res.status(404).json({error : "Error"});
    }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
