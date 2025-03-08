const UserModel = require("../Model/SystemConfigureModel/UserModel");
const RoleModel = require("../Model/SystemConfigureModel/RoleModel"); // Ensure Role exists
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

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Only super_admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find()
    .populate("role", "roleName")
    .select("-password")
    .lean();
  res.status(200).json(users);
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserByID = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id)
    .populate("role", "roleName")
    .select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ Validate Role ID if updating
  if (req.body.role) {
    const existingRole = await RoleModel.findById(req.body.role);
    if (!existingRole) {
      return res.status(400).json({ message: "Invalid role ID" });
    }
  }

  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.enterprise = req.body.enterprise || user.enterprise;
  user.businessName = req.body.businessName || user.businessName;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.address = req.body.address || user.address;
  user.taxIdentificationNumber =
    req.body.taxIdentificationNumber || user.taxIdentificationNumber;
  user.isActive =
    req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  await user.save();
  res.status(200).json({ message: "User updated successfully", user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
