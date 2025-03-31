import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function Chat(message, scrapedText, websiteLink) {
  const data = scrapedText.length > 5000 ? scrapedText.slice(0, 5000) + "..." : scrapedText;

  const prompt = `
  You are an AI assistant that answers questions strictly based on the given data from a website. Do not generate information outside the provided data.

  ### Website Source:
  ${websiteLink}

  ### Context (Extracted Website Data):
  ${data}

  ### User Query:
  ${message}

  ### Instructions:
  - Answer **only using the extracted website data**.
  - If the answer is **not found in the data**, respond with:
    **"I cannot find relevant information in the provided website data."**
  - Do **not** generate information beyond the provided content.
  - Keep your response **concise and relevant**.
`;
  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text;
  }catch(e) {
    console.log(e);
    return "Error";
  }
}
export default Chat;