const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // or your deployed frontend
    "X-Title": "PlantTaxa App"
  }
});

const chatWithBot = async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: message }],
    });

    const botMessage = completion.choices[0]?.message?.content || '🤖 No response.';
    res.json({ response: botMessage });

  } catch (error) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "🤖 Bot is overloaded or not responding.",
    });
  }
};

module.exports = { chatWithBot };
