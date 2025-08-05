const axios = require("axios");

exports.chatWithBot = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful plant care assistant.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://planttaxa.com", // optional
          "X-Title": "PlantTaxa", // optional
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ answer: botReply });
  } catch (error) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "🤖 Bot is overloaded or not responding." });
  }
};
