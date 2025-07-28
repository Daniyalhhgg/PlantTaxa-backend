const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .populate("replyTo"); // Populate replied message content
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.postMessage = async (req, res) => {
  const { content, replyTo } = req.body;
  const user = req.user;

  if (!content) return res.status(400).json({ error: "Message required" });

  try {
    const message = new Message({
      content,
      user: { _id: user._id, name: user.name },
      replyTo: replyTo || null,
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id).populate("replyTo");
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
};

exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content, replyTo } = req.body;
  const user = req.user;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (message.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    message.content = content;
    message.replyTo = replyTo || null;

    await message.save();
    const updated = await Message.findById(message._id).populate("replyTo");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (message.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await message.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
