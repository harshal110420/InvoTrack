const express = require("express");
const router = express.Router();

const {
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
} = require("../../Controller/SystemModelsControllers/ModuleController");

const isSuperAdmin = require("../../Middleware/IsSuperAdmin");
const authmiddleware = require("../../Middleware/AuthMiddleware");

// ✅ Proper REST API Routes
router.get("/all_modules", authmiddleware, getAllModules); 
router.post("/", authmiddleware, isSuperAdmin, createModule);
router.put("/:id", authmiddleware, isSuperAdmin, updateModule);
router.delete("/:id", authmiddleware, isSuperAdmin, deleteModule);

module.exports = router;
