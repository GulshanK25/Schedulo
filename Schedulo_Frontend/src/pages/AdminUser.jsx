import { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchAPI("/admin/getAllUsers", "GET", null, localStorage.getItem("token"));
      if (res.success) setUsers(res.data);
    };
    fetchUsers();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isDoctor ? "Yes" : "No"}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
