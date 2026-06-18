import { LogOut, Package, ShoppingBag, ShoppingCart, ShieldCheck, User } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function Layout() {
  const { user, cart, logout } = useShop();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="ShopEZ home">
          <ShoppingBag size={26} />
          <span>ShopEZ</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">
            <Package size={18} />
            Products
          </NavLink>
          {user && (
            <>
              <NavLink to="/cart">
                <ShoppingCart size={18} />
                Cart <span className="count">{cart.length}</span>
              </NavLink>
              <NavLink to="/profile">
                <User size={18} />
                Profile
              </NavLink>
            </>
          )}
          {user?.usertype === "admin" && (
            <NavLink to="/admin">
              <ShieldCheck size={18} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="auth-actions">
          {user ? (
            <button className="icon-text-button" type="button" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
