const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    size: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    orderStatus: { type: String, default: "order placed" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
