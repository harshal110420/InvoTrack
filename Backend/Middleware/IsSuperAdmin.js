const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // console.log("🔐 Permission Check Middleware Called");
      // console.log("👤 User in req:", req.user);

      if (!req.user || !req.user.role || !req.user.role.permissions) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No role/permissions" });
      }

      const userPermissions = req.user.role.permissions;
      // console.log("📜 User Permissions:", userPermissions);

      if (!userPermissions.includes(requiredPermission)) {
        // console.log(`🚫 Missing required permission: ${requiredPermission}`);
        return res
          .status(403)
          .json({ message: "Access denied: Missing permission" });
      }

      // console.log(`✅ Permission granted for: ${requiredPermission}`);
      next();
    } catch (error) {
      console.error("❌ Permission check error:", error);
      res.status(500).json({ message: "Server error in permission check" });
    }
  };
};

module.exports = checkPermission;
