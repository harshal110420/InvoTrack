const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  enterprise: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Base price without tax
  hsnCode: { type: mongoose.Schema.Types.ObjectId, ref: "HSNCode" }, // Link to HSN Code
  selectedTaxRate: { type: mongoose.Schema.Types.ObjectId, ref: "TaxConfig" }, // User-selected tax rate
  Item_location: { type: String },
});

module.exports = mongoose.model("Item", itemSchema);