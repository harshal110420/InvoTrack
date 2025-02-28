const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
    required: true,
  },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, // If purchased from a vendor
  initialStock: { type: Number, required: true }, // Stock at the time of entry
  currentStock: { type: Number, required: true }, // Updated dynamically on purchase/sale
  unit: { type: String, required: true }, // e.g., kg, pieces, liters
  reorderLevel: { type: Number, default: 10 }, // Minimum stock before alerting
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stock", stockSchema);
