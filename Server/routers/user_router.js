const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth_middleware");
const upload=require("../middleware/multer")
const User=require("../model/auth_model");
router.get("/profile", authenticate, (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


//update of profile
router.put("/profile/update",upload.single("avatar"), authenticate, async(req, res) => {
  try {
    const userId = req.user._id; // ✅ use _id (not id)
    const { username, email, phone, dob, gender } = req.body;
    const updateFields = {
      ...(username && { username }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(dob && { dob }),
      ...(gender && { gender }),
    };

    // ✅ handle avatar if file uploaded
    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    }

    // ✅ update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
