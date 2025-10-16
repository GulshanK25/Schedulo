import { useState, useEffect } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("addDoctor");

  // Common states
  const [message, setMessage] = useState("");

  // --- Add Doctor States ---
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    experience: "",
    feesPerConsultation: "",
    address: "",
  });

  const [timings, setTimings] = useState({ start: "09:00", end: "12:00" });

  // --- Manage Users States ---
  const [users, setUsers] = useState([]);

  // --- Manage Doctors States ---
  const [doctors, setDoctors] = useState([]);

  // --- Fetch users and doctors when dashboard loads ---
  useEffect(() => {
    if (activeTab === "manageUsers") fetchUsers();
    if (activeTab === "manageDoctors") fetchDoctors();
  }, [activeTab]);

  // --- Handlers ---
  const handleDoctorChange = (e) => setDoctor({ ...doctor, [e.target.name]: e.target.value });
  const handleTimingChange = (e) => setTimings({ ...timings, [e.target.name]: e.target.value });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetchAPI("/admin/addDoctor", "POST", { ...doctor, timings }, token);
      if (res.success) {
        setMessage("Doctor added successfully!");
        setDoctor({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          specialization: "",
          experience: "",
          feesPerConsultation: "",
          address: "",
        });
      } else setMessage(res.message);
    } catch (err) {
      console.error(err);
      setMessage("Error adding doctor");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetchAPI("/admin/getAllUsers", "GET", null, token);
      if (res.success) setUsers(res.data);
      else alert(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetchAPI("/admin/getAllDoctors", "GET", null, token);
      if (res.success) setDoctors(res.data);
      else alert(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab("addDoctor")}>Add Doctor</button>
        <button onClick={() => setActiveTab("manageUsers")}>Manage Users</button>
        <button onClick={() => setActiveTab("manageDoctors")}>Manage Doctors</button>
        <button onClick={() => setActiveTab("appointments")}>View Appointments</button>
      </div>

      <div className="tab-content">
        {activeTab === "addDoctor" && (
          <div className="add-doctor-section">
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleAddDoctor}>
              <input type="text" name="firstName" value={doctor.firstName} onChange={handleDoctorChange} placeholder="First Name" required />
              <input type="text" name="lastName" value={doctor.lastName} onChange={handleDoctorChange} placeholder="Last Name" required />
              <input type="email" name="email" value={doctor.email} onChange={handleDoctorChange} placeholder="Email" required />
              <input type="text" name="phoneNumber" value={doctor.phoneNumber} onChange={handleDoctorChange} placeholder="Phone Number" required />
              <input type="text" name="specialization" value={doctor.specialization} onChange={handleDoctorChange} placeholder="Specialization" required />
              <input type="text" name="experience" value={doctor.experience} onChange={handleDoctorChange} placeholder="Experience" required />
              <input type="number" name="feesPerConsultation" value={doctor.feesPerConsultation} onChange={handleDoctorChange} placeholder="Fees" required />
              <input type="text" name="address" value={doctor.address} onChange={handleDoctorChange} placeholder="Address" required />

              <div className="timing-inputs">
                <label>
                  Start Time:
                  <input type="time" name="start" value={timings.start} onChange={handleTimingChange} required />
                </label>
                <label>
                  End Time:
                  <input type="time" name="end" value={timings.end} onChange={handleTimingChange} required />
                </label>
              </div>

              <button type="submit">Add Doctor</button>
            </form>
          </div>
        )}

        {activeTab === "manageUsers" && (
          <div className="manage-users-section">
            <h2>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Is Admin</th>
                  <th>Is Doctor</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>{user.isDoctor ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "manageDoctors" && (
          <div className="manage-doctors-section">
            <h2>All Doctors</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.firstName} {doc.lastName}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.feesPerConsultation}</td>
                    <td>{doc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointments-section">
            <p>Appointments monitoring coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
