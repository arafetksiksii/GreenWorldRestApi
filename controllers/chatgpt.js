import express from 'express';
import axios from 'axios';

const router = express.Router();

const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

async function chatWithGPT(prompt) {
  try {
    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error during OpenAI API request:', error);
    throw error;
  }
}

router.post('/chat', async (req, res) => {
  const userInput = req.body.prompt;
  try {
    const response = await chatWithGPT(userInput);
    res.send({ response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
