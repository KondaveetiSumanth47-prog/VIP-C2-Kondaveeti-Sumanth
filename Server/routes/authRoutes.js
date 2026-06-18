const express = require("express");
const { registerUser, loginUser, getProfile, getAllUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
