import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { demoProducts } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function AdminProducts() {
  const [products, setProducts] = useState(demoProducts);
  const [sort, setSort] = useState("Popularity");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => {
        if (data.length) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const toggle = (value, selected, setSelected) => {
    setSelected(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    );
  };

  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const genderMatch =
        selectedGenders.length === 0 || selectedGenders.includes(product.gender);
      return categoryMatch && genderMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Price (low to high)") return discountedPrice(a.price, a.discount) - discountedPrice(b.price, b.discount);
      if (sort === "Price (high to low)") return discountedPrice(b.price, b.discount) - discountedPrice(a.price, a.discount);
      if (sort === "Discount") return b.discount - a.discount;
      return 0;
    });
  }, [products, selectedCategories, selectedGenders, sort]);

  return (
    <section className="admin-products-page">
      <aside className="admin-filters">
        <h2>Filters</h2>
        <h3>Sort By</h3>
        {["Popularity", "Price (low to high)", "Price (high to low)", "Discount"].map((item) => (
          <label key={item}>
            <input type="radio" checked={sort === item} onChange={() => setSort(item)} />
            {item}
          </label>
        ))}
        <h3>Categories</h3>
        {["Mobiles", "Electronics", "Sports-Equipment", "Fashion", "Groceries", "Footwear", "Accessories"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(item)}
              onChange={() => toggle(item, selectedCategories, setSelectedCategories)}
            />
            {item}
          </label>
        ))}
        <h3>Gender</h3>
        {["Men", "Women", "Unisex"].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={selectedGenders.includes(item)}
              onChange={() => toggle(item, selectedGenders, setSelectedGenders)}
            />
            {item}
          </label>
        ))}
      </aside>

      <div className="admin-product-area">
        <h1>All Products</h1>
        <div className="admin-shop-grid">
          {visible.map((product) => (
            <article className="admin-shop-card" key={product._id}>
              <img src={product.mainImg} alt={product.title} />
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <div>
                <strong>{currency(discountedPrice(product.price, product.discount))}</strong>
                <span>{currency(product.price)}</span>
                <small>({product.discount}% off)</small>
              </div>
              <Link to={`/admin/new-product/${product._id}`}>Update</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
