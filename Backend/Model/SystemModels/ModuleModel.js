const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true }, // "ACCOUNTS"
  name: { type: String, required: true }, // "Accounts"
  path: { type: String, required: true }, // "accounts-module"
  version: { type: String, default: "1.0" },
  isActive: { type: Boolean, default: true },
  orderBy: { type: Number }, // Sorting Order
});

module.exports = mongoose.model("Module", ModuleSchema);
