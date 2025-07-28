const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMessages,
  postMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/forumController");

router.get("/", getMessages);
router.post("/", protect, postMessage);
router.put("/:id", protect, updateMessage);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
