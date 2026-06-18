import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";

export default function Login() {
  const { login } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Login</h1>
        <StatusMessage type="error">{error}</StatusMessage>
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={update} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required />
        <button className="purple-submit" type="submit">
          Login
        </button>
        <p className="small-link">
          New to ShopEZ? <Link to="/register">Create an account</Link>
        </p>
      </form>
      </div>
    </section>
  );
}
