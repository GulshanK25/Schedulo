import { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchAPI("/admin/users", "GET", null, localStorage.getItem("token"));
      if (res.success) setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    const res = await fetchAPI(
      `/admin/users/${userId}`, 
      "DELETE", 
      null, 
      localStorage.getItem("token")
    );

    if (res.success) {
      // Remove the deleted user from the local state
      setUsers(users.filter((u) => u._id !== userId));
      alert("User deleted successfully");
    } else {
      alert("Failed to delete user: " + (res.message || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Doctor?</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isDoctor ? "Yes" : "No"}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => handleDelete(u._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}