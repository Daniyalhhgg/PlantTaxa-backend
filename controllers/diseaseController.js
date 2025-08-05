// const path = require("path");
// const { spawn } = require("child_process");

// const handleDiseaseDetection = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const imagePath = path.resolve(req.file.path); // ✅ FIXED: proper absolute path
//     console.log("📥 Image uploaded:", imagePath);

//     const pythonProcess = spawn("python", ["inference.py", imagePath]);

//     let prediction = "";
//     let errorOutput = "";

//     pythonProcess.stdout.on("data", (data) => {
//       console.log("✅ Python stdout:", data.toString());
//       prediction += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error("❌ Python stderr:", data.toString());
//       errorOutput += data.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       console.log("🏁 Python script finished with code", code);
//       if (code === 0) {
//         res.json({ prediction: prediction.trim() });
//       } else {
//         res.status(500).json({ error: "Prediction failed", details: errorOutput });
//       }
//     });

//   } catch (err) {
//     console.error("❌ Server error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };

// module.exports = { handleDiseaseDetection };
