const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const items = await Cart.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const item = await Cart.create({
    userId: req.user._id,
    productId: product._id,
    title: product.title,
    description: product.description,
    mainImg: product.mainImg,
    size,
    quantity,
    price: product.price,
    discount: product.discount
  });

  res.status(201).json(item);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const item = await Cart.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  res.json(item);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  res.json({ message: "Cart item removed" });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
