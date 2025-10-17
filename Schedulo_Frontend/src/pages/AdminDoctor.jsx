import { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const res = await fetchAPI("/admin/getAllDoctors", "GET", null, localStorage.getItem("token"));
    if (res.success) setDoctors(res.data);
  };

  const changeStatus = async (doctorId, status) => {
    const res = await fetchAPI(
      "/admin/changeAccountStatus",
      "POST",
      { doctorId, status },
      localStorage.getItem("token")
    );
    if (res.success) {
      alert("Status updated!");
      fetchDoctors();
    } else alert(res.message);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div>
      <h2>Manage Doctors</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.firstName} {doc.lastName}</td>
              <td>{doc.email}</td>
              <td>{doc.specialization}</td>
              <td>{doc.status}</td>
              <td>
                {doc.status === "pending" && (
                  <>
                    <button onClick={() => changeStatus(doc._id, "approved")}>Approve</button>
                    <button onClick={() => changeStatus(doc._id, "rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
