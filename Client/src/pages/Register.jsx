import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useShop } from "../context/ShopContext.jsx";

export default function Register() {
  const { register } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "user"
  });
  const [error, setError] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <section className="customer-screen">
      <CustomerHeader />
      <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Register</h1>
        <StatusMessage type="error">{error}</StatusMessage>
        <input name="username" placeholder="Username" value={form.username} onChange={update} required />
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={update} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required />
        <select name="usertype" value={form.usertype} onChange={update}>
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
        </select>
        <button className="purple-submit" type="submit">
          Register
        </button>
        <p className="small-link">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
      </div>
    </section>
  );
}
