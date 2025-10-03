
import User from "../models/usermodel.js";

const adminMiddleware = async (req, res, next) => {
  try {
   
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default adminMiddleware;
