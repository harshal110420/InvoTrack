const express = require("express");
const router = express.Router();

const {
  getPermissionsByRole,
  createOrUpdatePermission,
  getPermissionById,
  getAllPermissions,
  deletePermission,
} = require("../../Controller/SystemModelsControllers/PermissionController");

const isSuperAdmin = require("../../Middleware/IsSuperAdmin");
const authmiddleware = require("../../Middleware/AuthMiddleware");

router.get("/getPermission/:role", authmiddleware, getPermissionsByRole);
router.post("/create", authmiddleware, createOrUpdatePermission);
router.get("/getAll", authmiddleware, getAllPermissions); // Added route to get all permissions
router.get("/get/:id", authmiddleware, getPermissionById); // Added route to get permission by ID
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deletePermission);

module.exports = router;
