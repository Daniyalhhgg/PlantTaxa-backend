const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        inputs: `<s>[INST] ${userMessage} [/INST]`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generated = hfResponse.data?.[0]?.generated_text || "No response generated.";
    const reply = generated.replace(`<s>[INST] ${userMessage} [/INST]`, "").trim();

    res.json({ answer: reply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from Hugging Face" });
  }
});

module.exports = router;
