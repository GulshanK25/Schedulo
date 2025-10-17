import React, { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./doctorDashboard.css";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetchAPI("/doctor/appointments", "GET", null, token);
      if (res.success) {
        setAppointments(res.data);
      } else {
        alert(res.message || "Failed to fetch appointments.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (appointmentId, action) => {
    try {
      const res = await fetchAPI(
        `/doctor/appointment/${appointmentId}/${action}`,
        "PUT",
        null,
        token
      );
      if (res.success) {
        alert(`Appointment ${action}ed successfully!`);
        fetchAppointments();
      } else {
        alert(res.message || "Action failed.");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <p>
                <strong>Patient:</strong> {appt.userInfo}
              </p>
              <p>
                <strong>Date:</strong> {appt.date}
              </p>
              <p>
                <strong>Time:</strong> {appt.time}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
              </p>

              {appt.status === "Pending" && (
                <div className="actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleAction(appt._id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAction(appt._id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
