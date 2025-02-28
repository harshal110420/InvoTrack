const mongoose = require("mongoose");

const taxConfigSchema = new mongoose.Schema({
  GSTRateName: { type: String, required: true, unique: true }, // Ex: "GST 18%"
  IGST: { type: Number, required: true }, // Ex: 18
  CGST: { type: Number, required: true }, // Ex: 9
  SGST: { type: Number, required: true }, // Ex: 9
  UGST: { type: Number, required: false }, // Ex: 9 (optional, for UT)
});

module.exports = mongoose.model("TaxConfig", taxConfigSchema);
