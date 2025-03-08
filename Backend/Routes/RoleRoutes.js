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
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, isSuperAdmin, createRole);
router.get("/all", protect, getAllRoles);
router.get("/get/:id", protect, getSingleRole);
router.put("/update/:id", protect, isSuperAdmin, updateRole);
router.delete("/delete/:id", protect, isSuperAdmin, deleteRole);

module.exports = router;
