import { useState } from "react";
import AdminDoctors from "./AdminDoctor";
import AdminUsers from "./AdminUser";
import AddDoctor from "./adddoctor";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("doctors");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={tab === "doctors" ? "active" : ""} onClick={() => setTab("doctors")}>
            Manage Doctors
          </li>
          <li className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>
            Manage Users
          </li>
          <li className={tab === "add" ? "active" : ""} onClick={() => setTab("add")}>
            Add Doctor
          </li>
        </ul>
      </aside>

      <main className="content">
        {tab === "doctors" && <AdminDoctors />}
        {tab === "users" && <AdminUsers />}
        {tab === "add" && <AddDoctor />}
      </main>
    </div>
  );
}
