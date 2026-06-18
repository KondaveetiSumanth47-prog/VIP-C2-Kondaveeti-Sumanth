import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api.js";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopez_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState([]);

  const saveUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem("shopez_user", JSON.stringify(nextUser));
    else localStorage.removeItem("shopez_user");
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    saveUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveUser(data);
    return data;
  };

  const logout = () => {
    saveUser(null);
    setCart([]);
  };

  const refreshCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    const { data } = await api.get("/cart");
    setCart(data);
  };

  useEffect(() => {
    refreshCart().catch(() => setCart([]));
  }, [user]);

  const value = useMemo(
    () => ({ user, cart, login, register, logout, refreshCart }),
    [user, cart]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  return useContext(ShopContext);
}
