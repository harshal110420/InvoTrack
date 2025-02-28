const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
    required: true,
  },
  type: { type: String, enum: ["Incoming", "Outgoing"], required: true }, // Payment received or made
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }, // For customer payments
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" }, // For vendor payments
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Credit", "Online", "Cheque"],
    required: true,
  },
  referenceNumber: { type: String }, // Transaction ID, cheque number, etc.
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  transactionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
