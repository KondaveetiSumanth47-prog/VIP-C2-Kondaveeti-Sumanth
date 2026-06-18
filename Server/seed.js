const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  {
    title: "Urban Walk Sneakers",
    description: "Lightweight everyday sneakers with cushioned support and breathable mesh.",
    mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["6", "7", "8", "9", "10"],
    category: "Footwear",
    gender: "Unisex",
    price: 2499,
    discount: 18
  },
  {
    title: "Cotton Classic Hoodie",
    description: "Soft fleece hoodie with a relaxed fit, kangaroo pocket and ribbed cuffs.",
    mainImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "Fashion",
    gender: "Men",
    price: 1599,
    discount: 12
  },
  {
    title: "Wireless Sound Pods",
    description: "Compact earbuds with noise isolation, fast charging and a pocket-friendly case.",
    mainImg: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 3299,
    discount: 20
  },
  {
    title: "Everyday Tote Bag",
    description: "Durable tote bag with roomy compartments for shopping, college and work.",
    mainImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Accessories",
    gender: "Women",
    price: 1199,
    discount: 10
  },
  {
    title: "Iphone 12",
    description: "Apple Iphone with 8GB ram and powerful camera performance.",
    mainImg: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["128GB", "256GB"],
    category: "Mobiles",
    gender: "Unisex",
    price: 79999,
    discount: 15
  },
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
  },
  {
    title: "Realme buds",
    description: "TWS buds with 10.2mm drivers, deep bass and pocket charging case.",
    mainImg: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 3999,
    discount: 35
  },
  {
    title: "MRF cricket bat",
    description: "Popular willow wood cricket bat from MRF. Suitable for all format plays.",
    mainImg: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1531415080290-bc98545bab3f?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["M", "L"],
    category: "Sports-Equipment",
    gender: "Men",
    price: 1699,
    discount: 23
  },
  {
    title: "Carrom board",
    description: "Quality carrom board along with necessary equipment to make your free time joyful.",
    mainImg: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1580234810907-b40315b76418?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["M"],
    category: "Sports-Equipment",
    gender: "Unisex",
    price: 1838,
    discount: 50
  },
  {
    title: "Casual cotton shirt",
    description: "Comfort fit shirt for daily fashion and smart casual dressing.",
    mainImg: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "Fashion",
    gender: "Men",
    price: 1499,
    discount: 18
  },
  {
    title: "Grocery essentials",
    description: "Daily grocery combo with fresh pantry essentials.",
    mainImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Groceries",
    gender: "Unisex",
    price: 999,
    discount: 8
  },
  {
    title: "Minimalist Leather Wallet",
    description: "Sleek and slim wallet crafted from premium genuine leather, featuring RFID blocking technology.",
    mainImg: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1588444650733-d8c8541f22e7?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Accessories",
    gender: "Unisex",
    price: 899,
    discount: 15
  },
  {
    title: "Smart Fitness Watch",
    description: "Track your steps, heart rate, and sleep patterns with this water-resistant smart watch.",
    mainImg: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 4599,
    discount: 25
  },
  {
    title: "Premium Coffee Beans",
    description: "Single-origin 100% Arabica medium roast coffee beans with notes of caramel and cocoa.",
    mainImg: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["250g", "500g", "1kg"],
    category: "Groceries",
    gender: "Unisex",
    price: 699,
    discount: 10
  },
  {
    title: "Leather Loafers",
    description: "Classic handcrafted genuine leather loafers designed for maximum comfort and style.",
    mainImg: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80"
    ],
    sizes: ["7", "8", "9", "10", "11"],
    category: "Footwear",
    gender: "Men",
    price: 3499,
    discount: 20
  },
  {
    title: "Slim Fit Denim Jeans",
    description: "Classic blue denim jeans with a comfortable stretch fit.",
    mainImg: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["30", "32", "34", "36"],
    category: "Fashion",
    gender: "Men",
    price: 1999,
    discount: 15
  },
  {
    title: "Classic Trench Coat",
    description: "Elegant water-resistant double-breasted trench coat for all seasons.",
    mainImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["S", "M", "L", "XL"],
    category: "Fashion",
    gender: "Women",
    price: 4999,
    discount: 20
  },
  {
    title: "Floral Summer Skirt",
    description: "Lightweight flowy floral print skirt with an elastic waistband.",
    mainImg: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["S", "M", "L"],
    category: "Fashion",
    gender: "Women",
    price: 1299,
    discount: 10
  },
  {
    title: "Wireless Charging Pad",
    description: "Fast Qi-certified wireless charger compatible with iOS and Android devices.",
    mainImg: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 1499,
    discount: 25
  },
  {
    title: "Bluetooth Party Speaker",
    description: "Portable waterproof speaker with deep bass and interactive LED lights.",
    mainImg: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 5999,
    discount: 30
  },
  {
    title: "Ergonomic Gaming Mouse",
    description: "High-precision optical gaming mouse with customizable RGB lighting.",
    mainImg: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "Unisex",
    price: 2499,
    discount: 15
  },
  {
    title: "Premium Smartphone Gimbal",
    description: "3-axis handheld stabilizer for smartphones with smart tracking and zoom control.",
    mainImg: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Mobiles",
    gender: "Unisex",
    price: 6999,
    discount: 12
  },
  {
    title: "Rugged Phone Case",
    description: "Military-grade drop protective case with built-in kickstand.",
    mainImg: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["Standard"],
    category: "Mobiles",
    gender: "Unisex",
    price: 799,
    discount: 10
  },
  {
    title: "Dual USB-C Car Charger",
    description: "Fast-charging car adapter with dual ports for tablets and phones.",
    mainImg: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Mobiles",
    gender: "Unisex",
    price: 599,
    discount: 5
  },
  {
    title: "Polarized Sunglasses",
    description: "Classic aviator sunglasses with polarized UV400 protective lenses.",
    mainImg: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Accessories",
    gender: "Unisex",
    price: 1599,
    discount: 18
  },
  {
    title: "Canvas Backpack",
    description: "Vintage style water-resistant canvas travel and school laptop backpack.",
    mainImg: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Accessories",
    gender: "Unisex",
    price: 2799,
    discount: 22
  },
  {
    title: "Classic Leather Belt",
    description: "Genuine full-grain leather dress belt with a brushed silver buckle.",
    mainImg: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["32", "34", "36", "38"],
    category: "Accessories",
    gender: "Men",
    price: 999,
    discount: 15
  },
  {
    title: "Resistance Bands Set",
    description: "Set of 5 stackable exercise bands with handles, ankle straps, and door anchor.",
    mainImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["One Size"],
    category: "Sports-Equipment",
    gender: "Unisex",
    price: 899,
    discount: 20
  },
  {
    title: "Aluminum Tennis Racket",
    description: "Lightweight pre-strung recreational tennis racket for beginners.",
    mainImg: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["Standard"],
    category: "Sports-Equipment",
    gender: "Unisex",
    price: 1799,
    discount: 15
  },
  {
    title: "Organic Maple Syrup",
    description: "Pure Grade A amber maple syrup sourced from organic Canadian farms.",
    mainImg: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=80",
    carousel: [],
    sizes: ["250ml", "500ml"],
    category: "Groceries",
    gender: "Unisex",
    price: 499,
    discount: 8
  }
];

async function seed() {
  await connectDB();
  await Promise.all([Product.deleteMany(), Admin.deleteMany(), User.deleteMany()]);

  await Product.insertMany(products);
  await Admin.create({
    banner: "Fresh picks, fast checkout, secure orders.",
    categories: ["All", "Fashion", "Footwear", "Electronics", "Mobiles", "Accessories", "Sports-Equipment", "Groceries"]
  });
  await User.create({
    username: "Admin",
    email: "admin@shopez.com",
    password: await bcrypt.hash("admin123", 10),
    usertype: "admin"
  });

  console.log("ShopEZ seed data inserted");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
