const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true, trim: true }, // "super_admin"
  displayName: { type: String, trim: true }, // "Super Admin" (For UI display)
  isSystemRole: { type: Boolean, default: false }, // Prevent delete/update
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
