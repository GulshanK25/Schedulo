import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { fetchAPI } from "../api/fetchAPI";

export default function UserDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [activeTab, setActiveTab] = useState("doctors");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchAPI("/user/doctors", "GET", null, token);

      if (res.success && Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
        console.warn("No doctors found:", res.message);
        setDoctors([]);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchAPI("/user/appointments", "GET", null, token);

      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        console.warn("No appointments found:", res.message);
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };

  const filteredDoctors = specialization
    ? doctors.filter((doc) =>
        doc.specialization?.toLowerCase().includes(specialization.toLowerCase())
      )
    : doctors;

  return (
    <div className="user-dashboard">
      <aside className="sidebar">
        <h2>Schedulo</h2>
        <ul>
          <li
            className={activeTab === "doctors" ? "active" : ""}
            onClick={() => setActiveTab("doctors")}
          >
            Doctors
          </li>
          <li
            className={activeTab === "appointments" ? "active" : ""}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </li>
        </ul>
      </aside>
      <div className="content">
        <h1>Welcome, {user?.name || "User"} 👋</h1>
        <p className="subtitle">
          Manage your doctors and appointments in one place.
        </p>

        {activeTab === "doctors" && (
          <section className="doctors-section">
            <div className="section-header">
              <h2>Available Doctors</h2>
              <input
                type="text"
                placeholder="Filter by specialization..."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>

            <div className="doctor-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <div key={doc._id} className="doctor-card">
                    <h3>
                      Dr. {doc.firstName} {doc.lastName}
                    </h3>
                    <p>
                      <strong>Specialization:</strong> {doc.specialization}
                    </p>
                    <p>
                      <strong>Experience:</strong> {doc.experience} years
                    </p>
                    <p>
                      <strong>Fees:</strong> {doc.feesPerConsultation} krones
                    </p>
                    <p>
                      <strong>Timing:</strong>{" "}
                      {doc.timings?.morning?.from} - {doc.timings?.evening?.to}
                    </p>
                    <button
                      className="book-btn"
                      onClick={() => navigate("/book-appointment/:doctorId")}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <p>No doctors available.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "appointments" && (
          <section className="appointments-section">
            <h2>Your Appointments</h2>
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt._id} className="appointment-card">
                    <p>
                      <strong>Doctor:</strong> {apt.doctorName}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(apt.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {apt.status}
                    </p>
                  </div>
                ))
              ) : (
                <p>No appointments found.</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
