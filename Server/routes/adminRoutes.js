const express = require("express");
const { getAdminContent, upsertAdminContent } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAdminContent);
router.put("/", protect, adminOnly, upsertAdminContent);

module.exports = router;
