const express = require("express");
const { createUser, getAllUsers, getUserByID, updateUser, deleteUser } = require("../controllers/userController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(isSuperAdmin, createUser).get(protect, getAllUsers);
router.route("/:id").get(protect, getUserByID).put(isSuperAdmin, updateUser).delete(isSuperAdmin, deleteUser);

module.exports = router;
