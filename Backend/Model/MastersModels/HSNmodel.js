const mongoose = require("mongoose");

const hsnCodeSchema = new mongoose.Schema({
  HSNCode: { type: String, required: true, unique: true }, // Ex: "1234"
  taxRates: [{ type: mongoose.Schema.Types.ObjectId, ref: "TaxConfig" }], // Multiple GST rates allowed
});

module.exports = mongoose.model("HSNCode", hsnCodeSchema);
