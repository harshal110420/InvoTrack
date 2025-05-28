const UserModel = require("../Model/SystemConfigureModel/UserModel");
const RoleModel = require("../Model/SystemConfigureModel/RoleModel"); // Ensure Role exists
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mapEnterprisesByHierarchy = require("../Utility/mapEnterprisesByHierarchy");

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Only super_admin can create users)

const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      password,
      role,
      isSuperUser,
      createInEnterprise,
      enterprises,
      businessName,
      phoneNumber,
      address,
      taxIdentificationNumber,
      isActive,
    } = req.body;

    // Scenario 3: SUPER ADMIN
    if (isSuperUser) {
      const user = await UserModel.create({
        fullName,
        email,
        username,
        password,
        role,
        isSuperUser: true,
        createInEnterprise: null,
        enterprises: [],
        businessName,
        phoneNumber,
        address,
        taxIdentificationNumber,
        isActive,
      });

      return res
        .status(201)
        .json({ message: "Super admin user created", user });
    }

    // Validate required enterprise fields
    if (!createInEnterprise || !enterprises?.length) {
      return res.status(400).json({
        message:
          "createInEnterprise and enterprises are required for non-super users",
      });
    }

    const { mappedEnterprises } = await mapEnterprisesByHierarchy(
      createInEnterprise
    );
    const invalid = enterprises.filter(
      (eid) => !mappedEnterprises.includes(eid)
    );

    if (invalid.length) {
      return res.status(400).json({
        message: "Invalid enterprise(s) found outside of hierarchy scope",
        invalidEnterprises: invalid,
      });
    }

    const user = await UserModel.create({
      fullName,
      email,
      username,
      password,
      role,
      isSuperUser: false,
      createInEnterprise,
      enterprises,
      businessName,
      phoneNumber,
      address,
      taxIdentificationNumber,
      isActive,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("CreateUser Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Only super_admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find()
    .populate("role", "roleName displayName")
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
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      fullName,
      email,
      username,
      password,
      role,
      isSuperUser,
      createInEnterprise,
      enterprises,
      businessName,
      phoneNumber,
      address,
      taxIdentificationNumber,
      isActive,
    } = req.body;

    // Scenario 3: SUPER ADMIN
    if (isSuperUser) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          email,
          username,
          ...(password && { password }),
          role,
          isSuperUser: true,
          createInEnterprise: null,
          enterprises: [],
          businessName,
          phoneNumber,
          address,
          taxIdentificationNumber,
          isActive,
        },
        { new: true }
      );

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
        message: "Super admin updated successfully",
        user: updatedUser,
      });
    }

    // Non-super user - validate enterprise scope
    if (!createInEnterprise || !enterprises?.length) {
      return res.status(400).json({
        message:
          "createInEnterprise and enterprises are required for non-super users",
      });
    }

    const { mappedEnterprises } = await mapEnterprisesByHierarchy(
      createInEnterprise
    );
    const invalid = enterprises.filter(
      (eid) => !mappedEnterprises.includes(eid)
    );

    if (invalid.length) {
      return res.status(400).json({
        message: "Invalid enterprise(s) found outside of hierarchy scope",
        invalidEnterprises: invalid,
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        username,
        ...(password && { password }),
        role,
        isSuperUser: false,
        createInEnterprise,
        enterprises,
        businessName,
        phoneNumber,
        address,
        taxIdentificationNumber,
        isActive,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("UpdateUser Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
