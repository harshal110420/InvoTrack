const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },

  // 🌟 NEW FIELD: enterprise where user was created
  createInEnterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
    required: true,
  },

  // 🌟 UPDATED FIELD: Mapped Enterprises (multi-select)
  enterprises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
    },
  ],

  businessName: { type: String }, // Only for retailers
  phoneNumber: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  taxIdentificationNumber: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// 🔐 Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
