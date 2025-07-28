const axios = require("axios");

exports.chatWithBot = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        inputs: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data?.[0]?.generated_text || "I couldn't understand your message.";
    res.json({ answer: botReply });

  } catch (err) {
    console.error("Chatbot API Error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error || "Chatbot is currently unavailable",
    });
  }
};
