const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      taxRate: { type: mongoose.Schema.Types.ObjectId, ref: "TaxConfig" },
      total: { type: Number, required: true },
    },
  ],
  invoiceNumber: { type: String, unique: true, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Partially Paid"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Credit", "Online", "Cheque"],
    default: "Cash",
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
