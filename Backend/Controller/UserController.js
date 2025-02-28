const UserModel = require("../Model/UserModel");
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
    businessName,
    phoneNumber,
    address,
    taxIdentificationNumber,
    isActive,
  } = req.body;

  // 🛑 Only Super Admin can create users
  if (req.user.role !== "super_admin") {
    return res
      .status(403)
      .json({ message: "Access Denied! Only super_admin can create users." });
  }

  // ✅ Check if user already exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  // ✅ Hash Password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    fullName,
    email,
    password: hashedPassword, // 🔐 Save hashed password
    role,
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
