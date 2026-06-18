import { useEffect, useState } from "react";
import { Search, ShoppingCart, UserCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

export default function CustomerHeader() {
  const { user, cart } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  return (
    <header className="customer-header">
      <Link className="customer-brand" to="/">
        ShopEZ
      </Link>
      <form
        className="customer-search"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }}
      >
        <input
          placeholder="Search Electronics, Fashion, mobiles, etc.,"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <button type="submit" aria-label="Search products">
          <Search size={18} />
        </button>
      </form>
      <div className="customer-actions">
        {user ? (
          <>
            <Link className="user-chip" to="/profile">
              <UserCircle size={18} />
              {user.username}
            </Link>
            <Link className="cart-link" to="/cart" aria-label="Open cart">
              <ShoppingCart size={21} />
              <span>{cart.length}</span>
            </Link>
          </>
        ) : (
          <Link className="login-button" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
