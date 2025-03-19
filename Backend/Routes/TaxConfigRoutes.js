const express = require("express");
const router = express.Router();
const {
  createTaxConfig,
  getAllTaxConfigs,
  getTaxConfigByID,
  updateTaxConfig,
  deleteTaxConfig,
} = require("../Controller/TaxConfigController");

const isSuperAdmin = require("../middleware/isSuperAdmin");
const {authmiddleware} = require("../middleware/authMiddleware"); // If using JWT auth

// Routes
router.post("/", authmiddleware, isSuperAdmin, createTaxConfig); // Create Tax Config
router.get("/", authmiddleware, getAllTaxConfigs); // Get All Tax Configs
router.get("/:id", authmiddleware, getTaxConfigByID); // Get Single Tax Config
router.put("/:id", authmiddleware, isSuperAdmin, updateTaxConfig); // Update Tax Config
router.delete("/:id", authmiddleware, isSuperAdmin, deleteTaxConfig); // Delete Tax Config

module.exports = router;
