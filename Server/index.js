const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const port = process.env.PORT || 8000;

connectDB().then(async () => {
  try {
    const Admin = require("./models/Admin");
    const existing = await Admin.findOne();
    if (existing) {
      let changed = false;
      if (existing.banner.includes("photo-1441986300917-64674bd600d8")) {
        existing.banner = existing.banner.replace("photo-1441986300917-64674bd600d8", "photo-1607082348824-0a96f2a4b9da");
        if (existing.banners) {
          existing.banners = existing.banners.map(b => b.replace("photo-1441986300917-64674bd600d8", "photo-1607082348824-0a96f2a4b9da"));
        }
        changed = true;
        console.log("Migration: Replaced person banner with shopping bags banner");
      }

      const footwearUrl = "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80";
      if (existing.banners && !existing.banners.includes(footwearUrl)) {
        existing.banners.push(footwearUrl);
        existing.banner = existing.banner + ", " + footwearUrl;
        changed = true;
        console.log("Migration: Appended footwear banner to list");
      }

      const mobileUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80";
      if (existing.banners && !existing.banners.includes(mobileUrl)) {
        existing.banners.push(mobileUrl);
        existing.banner = existing.banner + ", " + mobileUrl;
        changed = true;
        console.log("Migration: Appended mobile phone banner to list");
      }

      const earpodsUrl = "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80";
      if (existing.banners && !existing.banners.includes(earpodsUrl)) {
        existing.banners.push(earpodsUrl);
        existing.banner = existing.banner + ", " + earpodsUrl;
        changed = true;
        console.log("Migration: Appended earpods banner to list");
      }

      if (changed) {
        await existing.save();
      }
    }

    const Product = require("./models/Product");
    const testProduct = await Product.findOne({ title: "Samsung Galaxy S24 Ultra" });
    if (!testProduct) {
      await Product.insertMany([
        {
          title: "Samsung Galaxy S24 Ultra",
          description: "The ultimate Galaxy phone with a 200MP camera, built-in S Pen, and Galaxy AI.",
          mainImg: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
          carousel: [],
          sizes: ["256GB", "512GB"],
          category: "Mobiles",
          gender: "Unisex",
          price: 124999,
          discount: 10
        },
        {
          title: "Google Pixel 8 Pro",
          description: "Engineered by Google AI, featuring the best photo/video capture and smart tools.",
          mainImg: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
          carousel: [],
          sizes: ["128GB", "256GB"],
          category: "Mobiles",
          gender: "Unisex",
          price: 99999,
          discount: 12
        },
        {
          title: "OnePlus 12 Flagship",
          description: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera, and super-fast 100W VOOC charging.",
          mainImg: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=900&q=80",
          carousel: [],
          sizes: ["256GB", "512GB"],
          category: "Mobiles",
          gender: "Unisex",
          price: 64999,
          discount: 8
        },
        {
          title: "iPhone 15 Pro",
          description: "Aerospace-grade titanium design, A17 Pro chip, and advanced camera systems.",
          mainImg: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
          carousel: [],
          sizes: ["128GB", "256GB", "512GB"],
          category: "Mobiles",
          gender: "Unisex",
          price: 134900,
          discount: 5
        }
      ]);
      console.log("Migration: Inserted new mobile phone products");
    }
  } catch (err) {
    console.error("Migration error:", err.message);
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "ShopEZ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`ShopEZ server running on http://localhost:${port}`);
});
