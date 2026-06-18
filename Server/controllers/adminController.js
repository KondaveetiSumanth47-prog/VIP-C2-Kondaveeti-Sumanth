const Admin = require("../models/Admin");
const asyncHandler = require("../middleware/asyncHandler");

const getAdminContent = asyncHandler(async (req, res) => {
  const content = await Admin.findOne().sort({ createdAt: -1 });
  
  const defaultBanners = [
    "https://img.freepik.com/free-vector/gradient-sale-background_23-2149028566.jpg",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80"
  ];

  if (!content) {
    res.json({ banner: "", banners: defaultBanners, categories: [] });
    return;
  }

  res.json({
    banner: content.banner,
    banners: content.banners && content.banners.length ? content.banners : defaultBanners,
    categories: content.categories
  });
});

const upsertAdminContent = asyncHandler(async (req, res) => {
  const existing = await Admin.findOne();

  let banners = [];
  if (req.body.banner) {
    banners = req.body.banner.split(",").map(b => b.trim()).filter(Boolean);
  }

  if (existing) {
    existing.banner = req.body.banner ?? existing.banner;
    if (req.body.banner !== undefined) {
      existing.banners = banners;
    } else if (req.body.banners !== undefined) {
      existing.banners = req.body.banners;
    }
    existing.categories = req.body.categories ?? existing.categories;
    const saved = await existing.save();
    res.json(saved);
    return;
  }

  const payload = {
    ...req.body,
    banners: req.body.banners || banners
  };
  const content = await Admin.create(payload);
  res.status(201).json(content);
});

module.exports = { getAdminContent, upsertAdminContent };
