import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api.js";
import { demoOrders, demoProducts } from "../data/demoData.js";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(demoProducts.length);
  const [orderCount, setOrderCount] = useState(demoOrders.length);
  const [userCount, setUserCount] = useState(1);
  const [banner, setBanner] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/orders"),
      api.get("/auth/users"),
      api.get("/admin")
    ])
      .then(([products, orders, users, adminContent]) => {
        setProductCount(products.data.length || demoProducts.length);
        setOrderCount(orders.data.length || demoOrders.length);
        setUserCount(users.data.length || 1);
        setBanner(adminContent.data?.banner || "");
      })
      .catch(() => {});
  }, []);

  const handleUpdateBanner = async () => {
    try {
      await api.put("/admin", { banner });
      setMessage("Banner updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update banner");
    }
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-stats">
        <article>
          <h2>Total users</h2>
          <strong>{userCount}</strong>
          <Link to="/admin/users">View all</Link>
        </article>
        <article>
          <h2>All Products</h2>
          <strong>{productCount}</strong>
          <Link to="/admin/products">View all</Link>
        </article>
        <article>
          <h2>All Orders</h2>
          <strong>{orderCount}</strong>
          <Link to="/admin/orders">View all</Link>
        </article>
        <article>
          <h2>Add Product</h2>
          <strong>(new)</strong>
          <Link to="/admin/new-product">Add now</Link>
        </article>
      </div>

      <form className="banner-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Update banner</h2>
        {message && <p className="admin-success">{message}</p>}
        <input
          value={banner}
          onChange={(event) => setBanner(event.target.value)}
          placeholder="Banner url"
        />
        <button type="button" onClick={handleUpdateBanner}>Update</button>
      </form>
    </section>
  );
}
