const mongoose = require("mongoose");

const enterpriseSchema = new mongoose.Schema(
  {
    enterpriseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: { type: String, required: true, unique: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    gstNumber: { type: String, trim: true, uppercase: true },
    panNumber: { type: String, trim: true, uppercase: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    enterpriseType: {
      type: String,
      required: true,
      enum: ["HEAD", "REGIONAL", "BRANCH"],
      default: "HEAD",
    },
    parentEnterprise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      default: null, // HEAD level ka koi parent nahi hoga
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enterprise", enterpriseSchema);
