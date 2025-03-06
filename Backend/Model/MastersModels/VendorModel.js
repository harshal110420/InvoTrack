const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  enterprise: { type: mongoose.Schema.Types.ObjectId, ref: "Enterprise" }, // Mapping with Enterprise
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phoneNumber: { type: String },
  gstNumber: { type: String }, // If applicable
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vendor", vendorSchema);
