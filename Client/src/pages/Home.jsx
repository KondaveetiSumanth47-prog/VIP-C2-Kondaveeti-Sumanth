import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { demoCategories } from "../data/demoData.js";

export default function Home() {
  const [categories, setCategories] = useState(demoCategories);
  const [banners, setBanners] = useState([
    "https://img.freepik.com/free-vector/gradient-sale-background_23-2149028566.jpg"
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin")
      .then(({ data }) => {
        if (data.banners && data.banners.length) {
          setBanners(data.banners);
        } else if (data.banner) {
          setBanners(data.banner.split(",").map(b => b.trim()).filter(Boolean));
        }
        if (data.categories?.length) setCategories(data.categories.filter((item) => item !== "All"));
      })
      .catch(() => setError("Showing demo categories until the backend is running."));
  }, []);

  const categoryImages = {
    Fashion: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=500&q=80",
    Electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80",
    Mobiles: "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=500&q=80",
    Groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    "Sports-Equipment": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=80",
    Footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    Accessories: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80"
  };

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="landing-banners-marquee-container">
        <div className="landing-banners-marquee-track">
          {banners.map((url, idx) => (
            <div key={`set1-${idx}`} className="landing-banner-marquee-item">
              <img
                src={url}
                alt={`ShopEZ banner ${idx + 1}`}
              />
            </div>
          ))}
          {banners.map((url, idx) => (
            <div key={`set2-${idx}`} className="landing-banner-marquee-item">
              <img
                src={url}
                alt={`ShopEZ banner duplicate ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      <div className="landing-categories">
        {categories.map((category) => (
          <Link
            className="category-card"
            key={category}
            to={`/products?category=${category}`}
          >
            <img src={categoryImages[category] || categoryImages.Fashion} alt={category} />
            <span>{category.replace("-", " ")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
