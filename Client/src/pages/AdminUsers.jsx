import { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/auth/users")
      .then(({ data }) => {
        if (data.length) setUsers(data);
        else {
          setUsers([
            {
              _id: "demo-admin",
              username: "Admin",
              email: "admin@shopez.com",
              usertype: "admin",
              createdAt: new Date().toISOString()
            }
          ]);
        }
      })
      .catch(() => {
        setUsers([
          {
            _id: "demo-admin",
            username: "Admin",
            email: "admin@shopez.com",
            usertype: "admin",
            createdAt: new Date().toISOString()
          }
        ]);
      });
  }, []);

  return (
    <section className="admin-list-page">
      <h1>Users</h1>
      <div className="admin-order-list">
        {users.map((user) => (
          <article className="admin-order-card" key={user._id} style={{ display: "block", padding: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", color: "#4f8fb9", margin: "0 0 4px" }}>{user.username}</h2>
              <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#8998a6" }}>{user.email}</p>
              <div style={{ fontSize: "12px", color: "#5f8cad" }}>
                <span>
                  <strong>Role: </strong>
                  {user.usertype}
                </span>
                <span style={{ marginLeft: "20px" }}>
                  <strong>Joined: </strong>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
