// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  loginUser,
  logoutUser,
  getMe,
} = require("../Controller/authController");
const { authmiddleware } = require("../middleware/authMiddleware");

router.post("/login", loginUser); // ❌ No middleware needed
router.post("/logout", logoutUser); // ❌ No middleware needed
router.get("/me", authmiddleware, getMe); // ✅ New route

module.exports = router;
