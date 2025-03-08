const jwt = require("jsonwebtoken");
const User = require("../Model/SystemConfigureModel/UserModel");

exports.authmiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("role");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// exports.adminMiddleware = (req, res, next) => {
//   if (!req.user || !["super_admin"].includes(req.user.role.roleName)) {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// };
