// File: Backend/controllers/usercontroller.cjs
const User = require("../models/usermodel.cjs");

// --- REGISTER ---
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    await User.create({ name, email, password });
    res.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Register error", error });
  }
};

// --- LOGIN ---
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: "dummyToken", // fake JWT for tests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error });
  }
};

// --- AUTH ---
const authController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Auth error", error });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
};
