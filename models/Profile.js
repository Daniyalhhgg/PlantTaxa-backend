// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  photo: { type: String, default: "" }, // Image URL or base64
  phone: { type: String, default: "" }
});

module.exports = mongoose.model("Profile", profileSchema);
