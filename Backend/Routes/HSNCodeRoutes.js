const express = require("express");
const router = express.Router();
const {
  createHSNCode,
  getAllHSNCodes,
  getSingleHSNCode,
  updateHSNCode,
  deleteHSNCode,
} = require("../../Controller/SystemConfigureController/hsnCodeController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/create", protect, isSuperAdmin, createHSNCode);
router.get("/all", protect, getAllHSNCodes);
router.get("/get/:id", protect, getSingleHSNCode);
router.put("/update/:id", protect, isSuperAdmin, updateHSNCode);
router.delete("/delete/:id", protect, isSuperAdmin, deleteHSNCode);

module.exports = router;
