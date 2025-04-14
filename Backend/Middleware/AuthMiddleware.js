const jwt = require("jsonwebtoken");
const User = require("../Model/SystemConfigureModel/UserModel");

const authmiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔐 Incoming Token:", token); // DEBUG

    if (!token) {
      console.log("⛔ Token missing in header");
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded Token:", decoded); // DEBUG

    req.user = await User.findById(decoded.id).populate("role");
    console.log("👤 User fetched from DB:", req.user); // DEBUG

    if (!req.user) {
      console.log("⛔ User not found in DB");
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    next();
  } catch (error) {
    console.log("❌ JWT Middleware Error:", error.message); // DEBUG
    res.status(401).json({ message: "Invalid token" });
  }
};

// exports.adminMiddleware = (req, res, next) => {
//   if (!req.user || !["super_admin"].includes(req.user.role.roleName)) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// };
module.exports = authmiddleware;
