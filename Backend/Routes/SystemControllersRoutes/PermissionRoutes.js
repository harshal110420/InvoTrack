const express = require("express");
const router = express.Router();

const {
  getPermissionsByRole,
  createOrUpdatePermission,
  deletePermission,
} = require("../../Controller/SystemModelsControllers/PermissionController");

const isSuperAdmin = require("../../Middleware/IsSuperAdmin");
const authmiddleware = require("../../Middleware/AuthMiddleware");

router.get("/getPermission/:role", getPermissionsByRole);
router.post("/create", authmiddleware, isSuperAdmin, createOrUpdatePermission);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deletePermission);

module.exports = router;