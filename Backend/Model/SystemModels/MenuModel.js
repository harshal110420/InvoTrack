const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  parentCode: { type: String, required: true }, // "00000000" for root
  moduleId: { type: String, required: true, ref: "Module" }, // Foreign key
  name: { type: String, required: true }, // "Account Master"
  type: {
    type: String,
    enum: ["Master", "Transaction", "Report"],
    required: true,
  }, // Master/Transaction/Report
  menuId: { type: String, required: true, unique: true }, // "accountmaster"
});

module.exports = mongoose.model("Menu", MenuSchema);
