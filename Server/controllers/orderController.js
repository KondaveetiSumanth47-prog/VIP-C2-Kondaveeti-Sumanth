const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const {
    productId,
    name,
    email,
    mobile,
    address,
    pincode,
    size,
    quantity = 1,
    paymentMethod
  } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const order = await Order.create({
    userId: req.user._id,
    name,
    email,
    mobile,
    address,
    pincode,
    title: product.title,
    description: product.description,
    mainImg: product.mainImg,
    size,
    quantity,
    price: product.price,
    discount: product.discount,
    paymentMethod,
    deliveryDate
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true, runValidators: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if current user is admin or the order owner
  if (req.user.usertype !== "admin" && order.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order cancelled successfully" });
});

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };
