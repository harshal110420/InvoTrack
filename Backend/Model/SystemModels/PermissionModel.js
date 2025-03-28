const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  role: { type: String, required: true }, // "super_admin"
  menuId: { type: String, required: true, ref: "Menu" }, // Foreign key to Menu
  actions: [{ type: String, enum: ["new", "edit", "view", "report"] }], // Actions allowed
});

module.exports = mongoose.model("Permission", PermissionSchema);
