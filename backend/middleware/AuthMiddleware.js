const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        console.error("JWT verification error:", err);

        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }

      // Find user
      const user = await User.findById(data.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }

      // IMPORTANT
      // Store logged-in user's ID
      req.userId = user._id;

      // Continue to next route
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};