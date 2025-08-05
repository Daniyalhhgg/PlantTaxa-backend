// test-openrouter.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

(async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "user", content: "Test message from CLI" }
      ]
    });

    console.log("✅ API Response:", completion.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
  }
})();
