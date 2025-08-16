const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

// Load environment variables
dotenv.config();

const products = [
  {
    name: "Aloe Vera",
    description: "A succulent plant species of the genus Aloe. Easy to care.",
    price: 10,
    image: "/uploads/products/aloe_vera.jpg",
    stock: 50,
  },
  {
    name: "Money Plant",
    description: "A popular indoor plant believed to bring wealth.",
    price: 8,
    image: "/uploads/products/money_plant.jpg",
    stock: 40,
  },
  {
    name: "Snake Plant",
    description: "A hardy plant that purifies the air and requires minimal care.",
    price: 12,
    image: "/uploads/products/snake_plant.jpg",
    stock: 30,
  },
  {
    name: "Peace Lily",
    description: "Elegant flowering indoor plant that thrives in low light.",
    price: 15,
    image: "/uploads/products/peace_lily.jpg",
    stock: 25,
  },
  {
    name: "Rose",
    description: "Classic flowering plant for your garden or balcony.",
    price: 20,
    image: "/uploads/products/rose.jpg",
    stock: 35,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    await Product.deleteMany(); // Clear existing products
    console.log("🗑️ Existing products removed");

    await Product.insertMany(products);
    console.log("🌱 Sample products inserted");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
