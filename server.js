const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

// ✅ Allowed frontends (CORS)
const allowedOrigins = [
  "https://your-frontend.vercel.app", // 🔄 Replace with your deployed frontend URL
  "http://localhost:3000",            // ✅ Local development
];

// ✅ CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Middleware to parse incoming requests
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ✅ Logger
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

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chatbot", require("./routes/chatbot")); // 🌟 DeepSeek model
app.use("/api/forum", require("./routes/forum"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/climate", require("./routes/climate"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/disease", require("./routes/disease"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌿 PlantTaxa Backend is running...");
});

// ✅ 404 Not Found
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(`❌ Server Error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is live at: http://localhost:${PORT}`);
});  