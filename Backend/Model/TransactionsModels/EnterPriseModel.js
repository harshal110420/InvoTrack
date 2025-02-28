const mongoose = require("mongoose");

const enterpriseSchema = new mongoose.Schema({
  enterpriseCode: { type: String, required: true, unique:true },
  name: { type: String, required: true, unique: true }, // Business Name
  ownerName: { type: String, required: true }, // Business Owner Name
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  gstNumber: { type: String }, // GSTIN
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  isActive: { type: Boolean, default: true }, // Business Active or Not
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enterprise", enterpriseSchema);