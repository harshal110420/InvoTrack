const UserModel = require("../Model/SystemConfigureModel/UserModel");
const RoleModel = require("../Model/SystemConfigureModel/RoleModel"); // Ensure Role exists
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mapEnterprisesByHierarchy = require("../Utility/mapEnterprisesByHierarchy");

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Only super_admin can create users)
const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    username,
    password,
    role,
    businessName,
    phoneNumber,
    address,
    taxIdentificationNumber,
    isActive,
    createInEnterprise,
  } = req.body;

  if (!req.user.role || req.user.role.toString() !== "super_admin") {
    return res
      .status(403)
      .json({ message: "Only super_admin can create users." });
  }

  const existingRole = await RoleModel.findById(role);
  if (!existingRole) {
    return res.status(400).json({ message: "Invalid role ID" });
  }

  const userExists = await UserModel.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "Username already exists." });
  }

  const { currentEnterpriseId, mappedEnterprises } =
    await mapEnterprisesByHierarchy(createInEnterprise);

  const user = await UserModel.create({
    fullName,
    email,
    username,
    password,
    role,
    businessName,
    phoneNumber,
    address,
    taxIdentificationNumber,
    isActive: isActive !== undefined ? isActive : true,
    createInEnterprise: currentEnterpriseId,
    enterprises: mappedEnterprises,
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

  if (req.body.role) {
    const existingRole = await RoleModel.findById(req.body.role);
    if (!existingRole) {
      return res.status(400).json({ message: "Invalid role ID" });
    }
  }

  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;
  user.username = req.body.username || user.username;
  user.role = req.body.role || user.role;
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

  if (req.body.createInEnterprise) {
    const { currentEnterpriseId, mappedEnterprises } =
      await mapEnterprisesByHierarchy(req.body.createInEnterprise);
    user.createInEnterprise = currentEnterpriseId;
    user.enterprises = mappedEnterprises;
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
