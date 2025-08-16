const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// ✅ Load environment variables
dotenv.config();

// ✅ Validate required .env vars
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env");
  process.exit(1);
}
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ Error: OPENROUTER_API_KEY is not defined in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend domains for CORS
const allowedOrigins = [
  "https://plant-taxa.vercel.app",        // main site
  "http://localhost:3000",                // local frontend
  "http://localhost:3001",                // local admin panel
  "https://admin-dashboard-pi-wine-91.vercel.app" // live admin panel
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middleware to parse JSON
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Logger (each request)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ================== API Routes ==================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/forum", require("./routes/forum"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/climate", require("./routes/climate"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/disease", require("./routes/disease"));

// ✅ E-commerce routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/api/products", productRoutes);  // Shop & ProductDetails
app.use("/api/orders", orderRoutes);      // Checkout

// ✅ Serve static product images (optional)
app.use("/uploads/products", express.static(path.join(__dirname, "uploads/products")));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌿 PlantTaxa Backend is running...");
});

// ✅ 404 Not Found
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err.stack || err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}`);
});
