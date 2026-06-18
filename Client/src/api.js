import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api"
});

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("shopez_user");
  if (saved) {
    const user = JSON.parse(saved);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
