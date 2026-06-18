import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { demoProducts } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshCart } = useShop();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const demoProduct = demoProducts.find((item) => item._id === id);
    if (demoProduct) {
      setProduct(demoProduct);
      setSize(demoProduct.sizes?.[0] || "");
      return;
    }

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSize(data.sizes?.[0] || "");
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load product."));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.post("/cart", { productId: id, size, quantity });
      await refreshCart();
      setMessage("Product added to cart.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add item to cart.");
    }
  };

  if (error && !product) {
    return (
      <section className="customer-screen">
        <CustomerHeader />
        <StatusMessage type="error">{error}</StatusMessage>
      </section>
    );
  }
  if (!product) {
    return (
      <section className="customer-screen">
        <CustomerHeader />
        <div className="empty-state">Loading product...</div>
      </section>
    );
  }

  const finalPrice = discountedPrice(product.price, product.discount);

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="details-page">
      <div className="details-media">
        <img src={product.mainImg} alt={product.title} />
      </div>
      <div className="details-info">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <div className="price-row large">
          <strong>{currency(finalPrice)}</strong>
          {product.discount > 0 && <span className="strike">{currency(product.price)}</span>}
        </div>
        <StatusMessage type="success">{message}</StatusMessage>
        <StatusMessage type="error">{error}</StatusMessage>
        <div className="option-grid">
          <label>
            Size
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              {(product.sizes || ["One Size"]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="details-actions">
          <button className="secondary-button" type="button" onClick={addToCart}>
            <ShoppingCart size={18} />
            Add to Cart
          </button>
          <Link className="primary-button" to={`/checkout/${product._id}`}>
            Shop Now
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
