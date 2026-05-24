import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const PROMPT_CONFIG = [
  { id: 'system', text: 'You are an expert news analyst.' },
  { id: 'summary', text: 'Provide a concise summary of the text below in exactly 5 sentences, using plain English.' },
  { id: 'keyFacts', text: 'Extract the most important points from the text below and present them as a clean bulleted list.' },
  { id: 'eli5', text: 'Explain the text below like the reader is 12 years old. Simplify complex terms.' },
  { id: 'biasCheck', text: 'Analyze the text below for bias. Flag loaded language or one-sided framing.' }
];

app.post('/api/digest', async (req, res) => {
  const { text, mode } = req.body;

  if (!text || !mode) {
    return res.status(400).json({ error: 'Missing required fields: text and mode.' });
  }

  try {
    // REQUIRED CONCEPT: Using reduce() to build the prompt dynamically
    const promptInstructions = PROMPT_CONFIG.reduce((acc, current) => {
      if (current.id === 'system') acc.system = current.text;
      if (current.id === mode) acc.instruction = current.text;
      return acc;
    }, { system: '', instruction: '' });

    if (!promptInstructions.instruction) {
      return res.status(400).json({ error: 'Invalid mode selected.' });
    }

    

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: promptInstructions.system },
        { role: 'user', content: `${promptInstructions.instruction}\n\nText:\n${text}` }
      ],
      model: 'llama-3.1-8b-instant', 
      temperature: 0.3, 
    });

    const result = chatCompletion.choices[0]?.message?.content || 'No output generated.';
    res.json({ result });

  } catch (error) {
    console.error('LLM API Error:', error);
    res.status(500).json({ error: 'Failed to process the digest. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));