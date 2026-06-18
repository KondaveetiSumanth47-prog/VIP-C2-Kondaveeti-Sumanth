import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import { demoProducts } from "../data/demoData.js";

const initial = {
  title: "",
  description: "",
  mainImg: "",
  img1: "",
  img2: "",
  img3: "",
  sizes: [],
  gender: "Unisex",
  category: "Fashion",
  price: "",
  discount: ""
};

export default function NewProduct() {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (id.startsWith("demo-")) {
        const product = demoProducts.find((p) => p._id === id);
        if (product) {
          setForm({
            title: product.title || "",
            description: product.description || "",
            mainImg: product.mainImg || "",
            img1: product.carousel?.[0] || "",
            img2: product.carousel?.[1] || "",
            img3: product.carousel?.[2] || "",
            sizes: product.sizes || [],
            gender: product.gender || "Unisex",
            category: product.category || "Fashion",
            price: product.price || "",
            discount: product.discount || ""
          });
        }
      } else {
        api
          .get(`/products/${id}`)
          .then(({ data }) => {
            setForm({
              title: data.title || "",
              description: data.description || "",
              mainImg: data.mainImg || "",
              img1: data.carousel?.[0] || "",
              img2: data.carousel?.[1] || "",
              img3: data.carousel?.[2] || "",
              sizes: data.sizes || [],
              gender: data.gender || "Unisex",
              category: data.category || "Fashion",
              price: data.price || "",
              discount: data.discount || ""
            });
          })
          .catch((err) => console.error(err));
      }
    } else {
      setForm(initial);
      setMessage("");
    }
  }, [id]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const toggleSize = (size) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size]
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      mainImg: form.mainImg,
      carousel: [form.img1, form.img2, form.img3].filter(Boolean),
      sizes: form.sizes.length ? form.sizes : ["M"],
      gender: form.gender,
      category: form.category,
      price: Number(form.price || 0),
      discount: Number(form.discount || 0)
    };

    try {
      if (id) {
        if (!id.startsWith("demo-")) {
          await api.put(`/products/${id}`, payload);
        }
        setMessage("Product updated");
        setTimeout(() => navigate("/admin/products"), 1500);
      } else {
        await api.post("/products", payload);
        setMessage("Product added");
        setForm(initial);
        setTimeout(() => navigate("/admin/products"), 1500);
      }
    } catch (err) {
      setMessage("Error saving product");
      console.error(err);
    }
  };

  return (
    <section className="new-product-page">
      <form className="new-product-card" onSubmit={submit}>
        <h1>{id ? "Update Product" : "New Product"}</h1>
        {message && <p className="admin-success">{message}</p>}
        <div className="new-product-row">
          <input name="title" value={form.title} onChange={update} placeholder="Product name" required />
          <input name="description" value={form.description} onChange={update} placeholder="Product Description" required />
        </div>
        <input name="mainImg" value={form.mainImg} onChange={update} placeholder="Thumbnail Img url" required />
        <div className="new-product-row three">
          <input name="img1" value={form.img1} onChange={update} placeholder="Add on img1 url" />
          <input name="img2" value={form.img2} onChange={update} placeholder="Add on img2 url" />
          <input name="img3" value={form.img3} onChange={update} placeholder="Add on img3 url" />
        </div>
        <h2>Available Size</h2>
        <div className="size-checks">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size}>
              <input type="checkbox" checked={form.sizes.includes(size)} onChange={() => toggleSize(size)} />
              {size}
            </label>
          ))}
        </div>
        <h2>Gender</h2>
        <div className="new-product-row three">
          <select name="gender" value={form.gender} onChange={update}>
            <option>Men</option>
            <option>Women</option>
            <option>Unisex</option>
          </select>
          <input name="category" value={form.category} onChange={update} placeholder="Category" />
          <input name="price" type="number" value={form.price} onChange={update} placeholder="Price" />
        </div>
        <input name="discount" type="number" value={form.discount} onChange={update} placeholder="Discount" />
        <button type="submit">{id ? "Update product" : "Add product"}</button>
      </form>
    </section>
  );
}
