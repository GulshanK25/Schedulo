import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Userdashboard.css";
import { fetchAPI } from "../api/fetchAPI";

export default function UserDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("doctors");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchNotifications();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchAPI("/user/doctors", "GET", null, token);
      if (res.success && Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
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
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchAPI("/user/notifications", "GET", null, token);
      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data.reverse());
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  // Get unique specializations from doctors (case-insensitive and trimmed)
  const specializations = useMemo(() => {
    const specsMap = new Map();
    doctors.forEach(doc => {
      if (doc.specialization && doc.specialization.trim() !== "") {
        const normalized = doc.specialization.trim();
        const key = normalized.toLowerCase();
        if (!specsMap.has(key)) {
          specsMap.set(key, normalized);
        }
      }
    });
    return Array.from(specsMap.values()).sort();
  }, [doctors]);

  // Filter doctors based on selected specialization
  const filteredDoctors = specialization
    ? doctors.filter((doc) => doc.specialization === specialization)
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
        <div className="header-top">
          <h1>Welcome, {user?.name || "User"} 👋</h1>
          <div className="notifications-wrapper">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔 {notifications.length > 0 && <span className="notif-count">{notifications.length}</span>}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <div key={idx} className="notification-item">
                      {n.message}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">No notifications</div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="subtitle">Manage your doctors and appointments in one place.</p>

        {activeTab === "doctors" && (
          <section className="doctors-section">
            <div className="section-header">
              <h2>Available Doctors</h2>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="specialization-dropdown"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
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
                      <strong>Timing:</strong> {doc.timings?.morning?.from} - {doc.timings?.evening?.to}
                    </p>
                    <button
                      className="book-btn"
                      onClick={() => navigate(`/book-appointment/${doc._id}`, { state: { doctorId: doc._id } })}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <p>No doctors available{specialization && " for this specialization"}.</p>
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
                      <strong>Date:</strong> {apt.date}
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