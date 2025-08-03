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
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // ✅ Correct DeepSeek model
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
          "HTTP-Referer": "http://localhost:3000", // optional (for leaderboard tracking)
          "X-Title": "PlantTaxa"                   // optional (for leaderboard tracking)
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content;
    res.json({ answer: botReply || "🤖 No response from DeepSeek." });

  } catch (err) {
    console.error("DeepSeek API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "❌ DeepSeek chatbot error." });
  }
};
