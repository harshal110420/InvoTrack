const express = require("express");
const router = express.Router();
const {
  createTaxConfig,
  getAllTaxConfigs,
  getTaxConfigByID,
  updateTaxConfig,
  deleteTaxConfig,
} = require("../controllers/taxConfigController");

const isSuperAdmin = require("../middleware/isSuperAdmin");
const protect = require("../middleware/authMiddleware"); // If using JWT auth

// Routes
router.post("/", protect, isSuperAdmin, createTaxConfig); // Create Tax Config
router.get("/", protect, getAllTaxConfigs); // Get All Tax Configs
router.get("/:id", protect, getTaxConfigByID); // Get Single Tax Config
router.put("/:id", protect, isSuperAdmin, updateTaxConfig); // Update Tax Config
router.delete("/:id", protect, isSuperAdmin, deleteTaxConfig); // Delete Tax Config

module.exports = router;
