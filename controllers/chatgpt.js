import express from 'express';
import axios from 'axios';

const router = express.Router();


const apiUrl = 'https://api.openai.com/v1/chat/completions';

async function chatWithGPT(prompt) {
  try {
    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: "donner moi une question de quiz sur la thème de la nature seulement , avec 4 choix et une seule réponse est correcte , si le thème donner n'est pas un thème qui à une relation avec la nature donner  une réponse qui dit que ce thème est n'est inclu ,soit exact avec cette requête et ne répond pas seulement  sur les question de cette requete" },
        { role: 'user', content: "thème" + prompt },
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


async function chatWithGPT2() {
  try {
    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: "générer moi une question de quiz sur la thème de la nature seulement , avec 4 choix et une seule réponse est correcte ,sur le thème de les nature , GreenWorld, déchet recyclable , polution  ,soit exact avec cette requête et ne répond pas seulement  sur les question de cette requete , afficher votre réponse avec des tiré pour quel soit claire , soit strict et donner moi seulement la question de quiz et les réponses et la réponse correcte sans politesse ni explication " },
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


router.post('/chat2', async (req, res) => {
  try {
    const response = await chatWithGPT2();
    res.send({ response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
