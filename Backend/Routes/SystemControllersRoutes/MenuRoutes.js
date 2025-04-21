const express = require("express");
const router = express.Router();
const {
  getAllMenusGrouped,
  getMenusByModule,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuById,
} = require("../../Controller/SystemModelsControllers/MenuController");

const isSuperAdmin = require("../../Middleware/IsSuperAdmin");
const authmiddleware = require("../../Middleware/AuthMiddleware");

// ✅ Proper REST API Routes
router.get("/all_menu", authmiddleware, getAllMenusGrouped);
router.get("/module/:moduleId", authmiddleware, getMenusByModule);
router.post("/create", authmiddleware, createMenu);
router.put("/update/:id", authmiddleware, updateMenu);
router.delete("/:id", authmiddleware, isSuperAdmin, deleteMenu);
router.get("/get/:id", authmiddleware, getMenuById);
module.exports = router;
