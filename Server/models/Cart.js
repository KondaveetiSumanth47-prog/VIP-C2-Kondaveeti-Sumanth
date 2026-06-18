const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    size: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
