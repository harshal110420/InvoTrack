const express = require("express");

const {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
} = require("../Controller/RoleController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create a New Role (Only for super_admin & super_user)
router.post("/create", authMiddleware, adminMiddleware, createRole);

// Get All Roles
router.get("/all", authMiddleware, getAllRoles);

// Get Single Role by ID
router.get("/get/:id", authMiddleware, getSingleRole);

// Update Role by ID (Only for super_admin & super_user)
router.put("/update/:id", authMiddleware, adminMiddleware, updateRole);

// Delete Role by ID (Only for super_admin & super_user)
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteRole);

module.exports = router;
