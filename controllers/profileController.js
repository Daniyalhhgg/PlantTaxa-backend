exports.getProfile = async (req, res) => {
  try {
    const { name, email, phone, photo } = req.user;
    res.status(200).json({ name, email, phone, photo });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { phone, photo } = req.body;

    if (phone !== undefined) req.user.phone = phone;
    if (photo !== undefined) req.user.photo = photo;

    await req.user.save();

    const { name, email } = req.user;
    res.status(200).json({ name, email, phone: req.user.phone, photo: req.user.photo });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile." });
  }
};
