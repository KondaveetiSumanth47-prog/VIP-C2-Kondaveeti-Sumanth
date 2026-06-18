const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, usertype } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    usertype: usertype === "admin" ? "admin" : "user"
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    usertype: user.usertype,
    token: generateToken(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    usertype: user.usertype,
    token: generateToken(user)
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

module.exports = { registerUser, loginUser, getProfile, getAllUsers };
