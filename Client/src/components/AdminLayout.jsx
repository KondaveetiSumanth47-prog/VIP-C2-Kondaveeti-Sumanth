import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function AdminLayout() {
  const { logout } = useShop();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <NavLink to="/admin" className="admin-brand">
          ShopEZ (admin)
        </NavLink>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/new-product">New Product</NavLink>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
