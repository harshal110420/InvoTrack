const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  parentCode: { type: String, required: true }, // "00000000" for root
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Module",
  }, // Foreign key
  name: { type: String, required: true }, // "Menus name"
  type: {
    type: String,
    enum: ["Master", "Transaction", "Report"],
    required: true,
  }, // Master/Transaction/Report
  menuId: { type: String, required: true, unique: true }, // "accountmaster"
  isActive: { type: Boolean, default: true },
  orderBy: { type: Number }, // Sorting Order
});

module.exports = mongoose.model("Menu", MenuSchema);
