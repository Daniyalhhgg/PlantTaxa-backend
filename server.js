// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

dotenv.config();

// ✅ Validate required .env vars
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Error: JWT_SECRET is not defined in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend domains for CORS
const allowedOrigins = [
  "https://plant-taxa.vercel.app",              // Main site
  "http://localhost:3000",                      // Local frontend
  "http://localhost:3001",                      // Local admin panel
  "https://admin-dashboard-pi-wine-91.vercel.app" // Live admin panel
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Origin:", origin || "Direct request");
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Ensure upload folder exists
const uploadPath = path.join(__dirname, "uploads", "plants");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📂 Created uploads/plants folder at:", uploadPath);
} else {
  console.log("📂 Upload folder exists:", uploadPath);
}

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chatbot", require("./routes/chatbot"));
app.use("/api/forum", require("./routes/forum"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/climate", require("./routes/climate"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/disease", require("./routes/disease"));
app.use("/api/plants", require("./routes/plant")); // <-- Plant routes will return full image URL

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
