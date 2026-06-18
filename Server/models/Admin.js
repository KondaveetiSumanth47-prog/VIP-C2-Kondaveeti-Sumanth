const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    banner: { type: String, required: true },
    banners: [{ type: String }],
    categories: [{ type: String, required: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
