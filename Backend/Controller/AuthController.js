const UserModel = require("../Model/SystemConfigureModel/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const user = await UserModel.findOne({ username })
      .populate("role")
      .populate("enterprises")
      .populate("createInEnterprise");

    if (!user) return res.status(401).json({ message: "Invalid User" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role?.roleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role?.roleName,
        isSuperUser: user.isSuperUser,
        enterprises: user.enterprises,
        createInEnterprise: user.createInEnterprise,
        selectedEnterprise: user.isSuperUser
          ? null
          : user.createInEnterprise?._id || user.enterprises?.[0]?._id || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // On client: delete token from localStorage or cookie
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role?.roleName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  loginUser,
  logoutUser,
  getMe,
};
