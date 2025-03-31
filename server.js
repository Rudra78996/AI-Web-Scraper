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

app.get('/scrap', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const {url} = req.body;
    console.log(url);
    scrapeWebsiteText(url)
    .then(text => res.json({"data": text}))
    .catch(err =>{
        res.send("Error 404");
        console.error(err)
    });
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
