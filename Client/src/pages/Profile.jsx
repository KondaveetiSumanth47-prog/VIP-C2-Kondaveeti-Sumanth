import { useEffect, useState } from "react";
import api from "../api.js";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { demoOrders } from "../data/demoData.js";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function Profile() {
  const { user, logout } = useShop();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then(({ data }) => {
        if (data.length) setOrders(data);
        else setOrders(demoOrders);
      })
      .catch(() => {
        setOrders(demoOrders);
        setError("Showing demo orders until the backend is running.");
      });
  }, []);

  const handleCancelOrder = async (id) => {
    if (id.startsWith("order-")) {
      setOrders((current) => current.filter((order) => order._id !== id));
      setSuccess("Order cancelled successfully (demo)");
      setTimeout(() => setSuccess(""), 3000);
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.delete(`/orders/${id}`);
      setOrders((current) => current.filter((order) => order._id !== id));
      setSuccess("Order cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="profile-layout">
        <aside className="profile-card">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Orders:</strong> {orders.length}</p>
          <button type="button" className="danger-button" onClick={logout}>Logout</button>
        </aside>
        <div className="orders-panel">
          <h1>Orders</h1>
          <StatusMessage type="error">{error}</StatusMessage>
          <StatusMessage type="success">{success}</StatusMessage>
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <img src={order.mainImg} alt={order.title} />
              <div>
                <h2>{order.title}</h2>
                <p>{order.description}</p>
                <div className="order-facts">
                  <span><strong>Size:</strong> {order.size || "M"}</span>
                  <span><strong>Quantity:</strong> {order.quantity}</span>
                  <span><strong>Price:</strong> {currency(discountedPrice(order.price, order.discount))}</span>
                  <span><strong>Payment method:</strong> {order.paymentMethod}</span>
                  <span><strong>Address:</strong> {order.address}</span>
                  <span><strong>Pincode:</strong> {order.pincode}</span>
                  <span><strong>Ordered on:</strong> {new Date(order.orderDate).toISOString().slice(0, 10)}</span>
                </div>
                <p><strong>Order status:</strong> {order.orderStatus}</p>
                {order.orderStatus !== "delivered" && (
                  <button 
                    className="danger-button" 
                    type="button"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
