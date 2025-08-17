const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant'); // adjust path

// GET all plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add plant
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    const plant = new Plant({ name, price });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
