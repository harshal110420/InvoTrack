const mongoose = require("mongoose");

const hsnCodeSchema = new mongoose.Schema({
  HSNCode: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    match: [/^\d{4,8}$/, "HSN Code must be 4 to 8 digits"] 
  },
  taxRates: [{ type: mongoose.Schema.Types.ObjectId, ref: "TaxConfig" }],
}, { timestamps: true });

module.exports = mongoose.model("HSNCode", hsnCodeSchema);
