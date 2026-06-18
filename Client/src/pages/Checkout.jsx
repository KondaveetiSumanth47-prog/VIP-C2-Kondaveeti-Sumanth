import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { demoProducts } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function Checkout() {
  const { id } = useParams();
  const { user } = useShop();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.username || "",
    email: user?.email || "",
    mobile: "",
    address: "",
    pincode: "",
    size: "",
    quantity: 1,
    paymentMethod: "Cash on Delivery"
  });

  useEffect(() => {
    const demoProduct = demoProducts.find((item) => item._id === id);
    if (demoProduct) {
      setProduct(demoProduct);
      setForm((current) => ({ ...current, size: demoProduct.sizes?.[0] || "" }));
      return;
    }

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setForm((current) => ({ ...current, size: data.sizes?.[0] || "" }));
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load product."));
  }, [id]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (id.startsWith("demo-")) {
      navigate("/profile");
      return;
    }
    try {
      await api.post("/orders", { ...form, productId: id, quantity: Number(form.quantity) });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place order.");
    }
  };

  if (!product) {
    return (
      <section className="customer-screen">
        <CustomerHeader />
        <div className="empty-state">Loading checkout...</div>
      </section>
    );
  }

  const payable = discountedPrice(product.price, product.discount) * Number(form.quantity);

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="checkout-page">
      <form className="form-panel checkout-form" onSubmit={submit}>
        <p className="eyebrow">Order details</p>
        <h1>Checkout</h1>
        <StatusMessage type="error">{error}</StatusMessage>
        <div className="two-col">
          <label>
            Name
            <input name="name" value={form.name} onChange={update} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={update} required />
          </label>
          <label>
            Mobile
            <input name="mobile" value={form.mobile} onChange={update} required />
          </label>
          <label>
            Pincode
            <input name="pincode" value={form.pincode} onChange={update} required />
          </label>
          <label>
            Size
            <select name="size" value={form.size} onChange={update}>
              {product.sizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={update} />
          </label>
        </div>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={update} required />
        </label>
        <label>
          Payment method
          <select name="paymentMethod" value={form.paymentMethod} onChange={update}>
            <option>Cash on Delivery</option>
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
          </select>
        </label>
        <button className="primary-button full" type="submit">
          Place Order
        </button>
      </form>

      <aside className="order-summary">
        <img src={product.mainImg} alt={product.title} />
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <div className="summary-row">
          <span>Payable</span>
          <strong>{currency(payable)}</strong>
        </div>
      </aside>
      </div>
    </section>
  );
}
