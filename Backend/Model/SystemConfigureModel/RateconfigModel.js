const mongoose = require("mongoose");

const taxConfigSchema = new mongoose.Schema(
  {
    GSTRateName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    IGST: {
      type: Number,
      required: true,
      min: [0, "IGST cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "IGST must be a valid number",
      },
    },
    CGST: {
      type: Number,
      required: true,
      min: [0, "CGST cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "CGST must be a valid number",
      },
    },
    SGST: {
      type: Number,
      required: true,
      min: [0, "SGST cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "SGST must be a valid number",
      },
    },
    UGST: {
      type: Number,
      min: [0, "UGST cannot be negative"],
      default: null,
      validate: {
        validator: Number.isFinite,
        message: "UGST must be a valid number",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxConfig", taxConfigSchema);
