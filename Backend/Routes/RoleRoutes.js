const express = require("express");
const router = express.Router();

const {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
} = require("../Controller/RoleController");

const isSuperAdmin = require("../middleware/isSuperAdmin");
const { authmiddleware } = require("../middleware/authMiddleware");

router.post("/create", authmiddleware, isSuperAdmin, createRole);
router.get("/all", authmiddleware, getAllRoles);
router.get("/get/:id", authmiddleware, getSingleRole);
router.put("/update/:id", authmiddleware, isSuperAdmin, updateRole);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deleteRole);

module.exports = router;
