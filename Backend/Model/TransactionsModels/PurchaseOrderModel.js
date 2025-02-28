const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
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
      total: { type: Number, required: true },
    },
  ],
  purchaseOrderNumber: { type: String, unique: true, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Partially Paid"],
    default: "Pending",
  },
  expectedDeliveryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
