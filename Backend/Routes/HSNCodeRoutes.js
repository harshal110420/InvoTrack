const express = require("express");
const router = express.Router();
const {
  createHSNCode,
  getAllHSNCodes,
  getSingleHSNCode,
  updateHSNCode,
  deleteHSNCode,
} = require("../Controller/HSNCodeController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const authmiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/create", authmiddleware, isSuperAdmin, createHSNCode);
router.get("/all", authmiddleware, getAllHSNCodes);
router.get("/get/:id", authmiddleware, getSingleHSNCode);
router.put("/update/:id", authmiddleware, isSuperAdmin, updateHSNCode);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deleteHSNCode);

module.exports = router;
