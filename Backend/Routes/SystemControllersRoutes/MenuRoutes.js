const express = require("express");
const router = express.Router();
const {
  getAllMenusGrouped,
  getMenusByModule,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../../Controller/SystemModelsControllers/MenuController");

const isSuperAdmin = require("../../Middleware/IsSuperAdmin");
const authmiddleware = require("../../Middleware/AuthMiddleware");

// ✅ Proper REST API Routes
router.get("/all_menu", authmiddleware, getAllMenusGrouped);
router.get("/module/:moduleId", authmiddleware, getMenusByModule);
router.post("/", authmiddleware, isSuperAdmin, createMenu);
router.put("/:id", authmiddleware, isSuperAdmin, updateMenu);
router.delete("/:id", authmiddleware, isSuperAdmin, deleteMenu);

module.exports = router;
