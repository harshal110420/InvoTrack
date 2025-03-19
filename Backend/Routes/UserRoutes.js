const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../Controller/UserController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const { authmiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authmiddleware, isSuperAdmin, createUser);
router.get("/all", authmiddleware, getAllUsers);
router.get("/get/:id", authmiddleware, getUserByID);
router.put("/update/:id", authmiddleware, isSuperAdmin, updateUser);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deleteUser);

module.exports = router;
