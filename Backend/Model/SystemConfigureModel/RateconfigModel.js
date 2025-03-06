const mongoose = require("mongoose");

const taxConfigSchema = new mongoose.Schema({
  GSTRateName: { type: String, required: true, unique: true, trim: true },
  IGST: { type: Number, required: true, min: 0 },
  CGST: { type: Number, required: true, min: 0 },
  SGST: { type: Number, required: true, min: 0 },
  UGST: { type: Number, min: 0 }, // Optional
}, { timestamps: true });

module.exports = mongoose.model("TaxConfig", taxConfigSchema);
