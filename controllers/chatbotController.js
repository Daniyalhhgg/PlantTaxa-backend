const axios = require("axios");
require("dotenv").config();

exports.chatWithBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3n-e2b-it:free", // ✅ Using Google Gemma 3n 2B
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-frontend-url.vercel.app", // Optional, for leaderboard
          "X-Title": "PlantTaxa" // Optional
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content;
    res.json({ answer: botReply || "🤖 No response from Gemma." });

  } catch (err) {
    console.error("Gemma API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "❌ Gemma chatbot error." });
  }
};
