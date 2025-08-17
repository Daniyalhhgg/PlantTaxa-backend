const Plant = require("../models/Plant");

// Add new plant (Admin only)
const addPlant = async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ msg: "Name and price are required" });
    }

    const plant = new Plant({ name, price, description, imageUrl });
    await plant.save();

    res.status(201).json(plant);
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all plants (Public)
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { addPlant, getAllPlants };
