const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../Controller/UserController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const authmiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authmiddleware, createUser);
router.get("/all", authmiddleware, getAllUsers);
router.get("/get/:id", authmiddleware, getUserByID);
router.put("/update/:id", authmiddleware, updateUser);
router.delete("/delete/:id", authmiddleware, deleteUser);

module.exports = router;
