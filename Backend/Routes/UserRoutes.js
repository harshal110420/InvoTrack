const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../Controller/UserController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, isSuperAdmin, createUser);
router.get("/all", protect, getAllUsers);
router.get("/get/:id", protect, getUserByID);
router.put("/update/:id", protect, isSuperAdmin, updateUser);
router.delete("/delete/:id", protect, isSuperAdmin, deleteUser);

module.exports = router;
