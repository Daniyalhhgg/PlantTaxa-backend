const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;

    const result = {
      city: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      wind_speed: data.wind.speed,
    };

    res.json(result);
  } catch (error) {
    console.error("❌ Weather API Error:", error.message);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

module.exports = router;
