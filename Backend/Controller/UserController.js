const UserModel = require("../Model/UserModel");
const RoleModel = require("../Model/RoleModel"); // Ensure Role exists
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Only super_admin can create users)
const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
    enterprise,
    businessName,
    phoneNumber,
    address,
    taxIdentificationNumber,
    isActive,
  } = req.body;

  // 🛑 Ensure only Super Admin can create users
  if (!req.user.role || req.user.role.toString() !== "super_admin") {
    return res
      .status(403)
      .json({ message: "Access Denied! Only super_admin can create users." });
  }

  // ✅ Validate Role ID
  const existingRole = await RoleModel.findById(role);
  if (!existingRole) {
    return res.status(400).json({ message: "Invalid role ID" });
  }

  // ✅ Check if user already exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User with this email already exists." });
  }

  // 🔐 Hash Password (Handled in Schema, so no need here)
  const user = await UserModel.create({
    fullName,
    email,
    password, // Password will be hashed in the model
    role,
    enterprise,
    businessName,
    phoneNumber,
    address,
    taxIdentificationNumber,
    isActive: isActive !== undefined ? isActive : true, // Default true
  });

  if (user) {
    res.status(201).json({ message: "User created successfully", user });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

module.exports = { createUser };
