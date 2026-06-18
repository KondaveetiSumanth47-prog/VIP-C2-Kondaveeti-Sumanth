import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { demoProducts } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function Cart() {
  const { cart, refreshCart } = useShop();
  const displayCart = cart.length
    ? cart
    : demoProducts.slice(2, 4).map((product) => ({
        ...product,
        productId: product._id,
        quantity: 1,
        size: "M"
      }));

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    await refreshCart();
  };

  const total = displayCart.reduce(
    (sum, item) => sum + discountedPrice(item.price, item.discount) * item.quantity,
    0
  );
  const mrp = displayCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = mrp - total;

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="cart-layout">
        <div className="cart-items-panel">
          {!cart.length && <StatusMessage>Showing demo cart items. Add products after login to use your cart.</StatusMessage>}
          {displayCart.map((item) => (
            <article className="cart-item" key={item._id}>
              <img src={item.mainImg} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span><strong>Size:</strong> {item.size || "M"}</span>
                <span><strong>Quantity:</strong> {item.quantity}</span>
                <strong>{currency(discountedPrice(item.price, item.discount) * item.quantity)}</strong>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => cart.length && removeItem(item._id)}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="price-details">
          <h1>Price Details</h1>
          <p><span>Total MRP:</span> <strong>{currency(mrp)}</strong></p>
          <p><span>Discount on MRP:</span> <strong className="green">- {currency(discount)}</strong></p>
          <p><span>Delivery Charges:</span> <strong className="red">+ {currency(0)}</strong></p>
          <div className="final-price">
            <span>Final Price:</span>
            <strong>{currency(total)}</strong>
          </div>
          <Link className="purple-submit" to={`/checkout/${displayCart[0]?.productId || displayCart[0]?._id}`}>
            Place order
          </Link>
        </aside>
      </div>
    </section>
  );
}
