const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["super_admin", "admin", "retailer", "whole_saler"],
    default: "retailer",
  },
  businessName: { type: String }, // Only for retailers
  phoneNumber: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  taxIdentificationNumber: { type: String }, // GST or other tax ID
  isActive: { type: Boolean, default: true }, // For user activation/deactivation
  createdAt: { type: Date, default: Date.now },
});

// hash password method

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare Password Method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);