import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

let getOpenAI = () => {
  if (!process.env.GROQ_API_KEY) return null;
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openai = getOpenAI();

    if (!openai) {
      return res.status(500).json({ 
        error: 'Chatbot API key is not configured yet. Set GROQ_API_KEY in the backend .env file.' 
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are Raksha, an AI safety assistant specialized in women's safety, self-defense, and legal rights in India. 
Use a supportive, clear, and reassuring tone. Give concise, actionable advice. Format your answers beautifully using Markdown. Use bullet points for lists, bolding for emphasis, and keep paragraphs short.
If someone is in immediate danger, advise them to call **112** (National Emergency Number) or **1091** (Women's Helpline).`
        },
        {
          role: 'user',
          content: message
        }
      ],
    });

    const responseText = completion.choices[0].message.content;
    res.json({ response: responseText });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ error: 'An error occurred while generating a response.' });
  }
});

export default router;
