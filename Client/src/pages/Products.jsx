import { useEffect, useMemo, useState } from "react";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { demoProducts } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";
import { Link, useSearchParams } from "react-router-dom";
const sortOptions = ["Popular", "Price (low to high)", "Price (high to low)", "Discount"];
const categories = ["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries", "Footwear", "Accessories"];
const genders = ["Men", "Women", "Unisex"];

export default function Products() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState(demoProducts);
  const [sort, setSort] = useState("Popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products", { params: { search: searchQuery } })
      .then(({ data }) => {
        if (data.length) setProducts(data);
      })
      .catch(() => setError("Showing demo products until the backend is running."));
  }, [searchQuery]);

  const toggle = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    );
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategory
          ? product.category === selectedCategory
          : selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);
      const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(product.gender);
      const searchMatch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && genderMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Price (low to high)") return discountedPrice(a.price, a.discount) - discountedPrice(b.price, b.discount);
      if (sort === "Price (high to low)") return discountedPrice(b.price, b.discount) - discountedPrice(a.price, a.discount);
      if (sort === "Discount") return b.discount - a.discount;
      return 0;
    });
  }, [products, selectedCategory, selectedCategories, selectedGenders, searchQuery, sort]);

  return (
    <section className="customer-screen products-screen">
      <CustomerHeader />
      <div className="products-layout">
        <aside className="filters-panel">
          <h2>Filters</h2>
          <div className="filter-group">
            <h3>Sort By</h3>
            {sortOptions.map((option) => (
              <label className="check-row" key={option}>
                <input
                  type="radio"
                  checked={sort === option}
                  onChange={() => setSort(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>{selectedCategory || "All products"}</h3>
            {categories.map((category) => (
              <label className="check-row" key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggle(category, selectedCategories, setSelectedCategories)}
                />
                {category.replace("-", " ")}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Gender</h3>
            {genders.map((gender) => (
              <label className="check-row" key={gender}>
                <input
                  type="checkbox"
                  checked={selectedGenders.includes(gender)}
                  onChange={() => toggle(gender, selectedGenders, setSelectedGenders)}
                />
                {gender}
              </label>
            ))}
          </div>
        </aside>

        <section className="products-listing">
          <h1>{selectedCategory || "All Products"}</h1>
          <StatusMessage type="error">{error}</StatusMessage>
          <div className="shop-grid">
            {visibleProducts.map((product) => {
              const finalPrice = discountedPrice(product.price, product.discount);
              return (
                <Link className="shop-card" key={product._id} to={`/products/${product._id}`}>
                  <img src={product.mainImg} alt={product.title} />
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <div className="shop-price">
                    <strong>{currency(finalPrice)}</strong>
                    <span>{currency(product.price)}</span>
                    <small>({product.discount}% off)</small>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
