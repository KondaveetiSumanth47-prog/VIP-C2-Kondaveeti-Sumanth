import { useEffect, useState } from "react";
import api from "../api.js";
import { demoOrders } from "../data/demoData.js";
import { currency } from "../utils/pricing.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState(demoOrders);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => {
        if (data.length) setOrders(data);
      })
      .catch(() => {});
  }, []);

  const handleUpdateStatus = async (id) => {
    const nextStatus = statusUpdates[id];
    if (!nextStatus) return;

    if (id.startsWith("order-")) {
      setOrders((current) =>
        current.map((order) => (order._id === id ? { ...order, orderStatus: nextStatus } : order))
      );
      return;
    }

    try {
      await api.put(`/orders/${id}/status`, { orderStatus: nextStatus });
      setOrders((current) =>
        current.map((order) => (order._id === id ? { ...order, orderStatus: nextStatus } : order))
      );
      // Clean up update state
      const nextMap = { ...statusUpdates };
      delete nextMap[id];
      setStatusUpdates(nextMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (id) => {
    if (id.startsWith("order-")) {
      setOrders((current) => current.filter((order) => order._id !== id));
      return;
    }

    try {
      await api.delete(`/orders/${id}`);
      setOrders((current) => current.filter((order) => order._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="admin-list-page">
      <h1>Orders</h1>
      <div className="admin-order-list">
        {orders.map((order) => (
          <article className="admin-order-card" key={order._id}>
            <img src={order.mainImg} alt={order.title} />
            <div>
              <h2>{order.title}</h2>
              <p>{order.description}</p>
              <div className="admin-order-facts">
                <span><strong>Size:</strong> {order.size}</span>
                <span><strong>Quantity:</strong> {order.quantity}</span>
                <span><strong>Price:</strong> {currency(order.price)}</span>
                <span><strong>Payment method:</strong> {order.paymentMethod}</span>
                <span><strong>UserId:</strong> {order.userId || "64ecdfcad3631d148df3ce2e1"}</span>
                <span><strong>Name:</strong> {order.name}</span>
                <span><strong>Email:</strong> {order.email}</span>
                <span><strong>Mobile:</strong> {order.mobile}</span>
                <span><strong>Ordered on:</strong> {new Date(order.orderDate).toISOString().slice(0, 10)}</span>
                <span><strong>Address:</strong> {order.address}</span>
                <span><strong>Pincode:</strong> {order.pincode}</span>
              </div>
              <div className="admin-order-actions">
                <span><strong>Order status:</strong> {order.orderStatus}</span>
                <select
                  value={statusUpdates[order._id] || order.orderStatus}
                  onChange={(event) =>
                    setStatusUpdates({ ...statusUpdates, [order._id]: event.target.value })
                  }
                >
                  <option value="" disabled>Update order status</option>
                  <option>order placed</option>
                  <option>In-transit</option>
                  <option>delivered</option>
                </select>
                <button type="button" onClick={() => handleUpdateStatus(order._id)}>Update</button>
                <button className="cancel" type="button" onClick={() => handleCancelOrder(order._id)}>
                  Cancel
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
