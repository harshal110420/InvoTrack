// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginUser, logoutUser } = require("../Controller/AuthController");

router.post("/login", loginUser); // ❌ No middleware needed
router.post("/logout", logoutUser); // ❌ No middleware needed

module.exports = router;
