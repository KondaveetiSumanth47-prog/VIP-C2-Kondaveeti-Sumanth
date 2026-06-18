const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    carousel: [{ type: String }],
    sizes: [{ type: String }],
    category: { type: String, required: true },
    gender: { type: String, default: "Unisex" },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
