const isSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== "super_admin") {
    return res.status(403).json({
      message: "Access Denied! Only super_admin can perform this action.",
    });
  }
  next();
};
module.exports = isSuperAdmin;
