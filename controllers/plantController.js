const Plant = require("../models/Plant");

// Existing functions...
const addPlant = async (req, res) => { /* same as before */ };
const getAllPlants = async (req, res) => { /* same as before */ };

// New delete function
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ msg: "Plant not found" });
    }
    await plant.deleteOne();
    res.status(200).json({ msg: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { addPlant, getAllPlants, deletePlant };
