const isSuperAdmin = (req, res, next) => {
  try {
    // Ensure user and role exist
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: User role not found." });
    }

    // Check if the role is "super_admin"
    if (req.user.role.roleName !== "super_admin") {
      return res.status(403).json({
        message: "Access Denied! Only super_admin can perform this action.",
      });
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error in role verification." });
  }
};

module.exports = isSuperAdmin;
