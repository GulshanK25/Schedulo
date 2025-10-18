import React, { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./doctorDashboard.css";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [notesInput, setNotesInput] = useState({});
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
      alert("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (appointmentId, action) => {
    try {
      const res = await fetchAPI(
        `/doctor/appointments/status`,
        "PUT",
        { appointmentId, action },
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
      alert("Error updating appointment");
    }
  };

  const handleAddNotes = async (appointmentId) => {
    const notes = notesInput[appointmentId];
    if (!notes) return alert("Please enter notes before saving.");

    try {
      const res = await fetchAPI(
        "/doctor/appointments/notes",
        "PUT",
        { appointmentId, notes },
        token
      );
      if (res.success) {
        alert("Notes saved successfully!");
        fetchAppointments();
        setNotesInput({ ...notesInput, [appointmentId]: "" });
      } else {
        alert(res.message || "Failed to save notes.");
      }
    } catch (err) {
      console.error("Error adding notes:", err);
      alert("Error adding notes");
    }
  };

  const handleDeleteNotes = async (appointmentId) => {
    try {
      const res = await fetchAPI(
        `/doctor/delete-notes/${appointmentId}`,
        "DELETE",
        null,
        token
      );
      if (res.success) {
        alert("Notes deleted successfully!");
        fetchAppointments();
      } else {
        alert(res.message || "Failed to delete notes.");
      }
    } catch (err) {
      console.error("Error deleting notes:", err);
      alert("Error deleting notes");
    }
  };

  if (loading) return <p className="loading">Loading appointments...</p>;

  const acceptedAppointments = appointments.filter(
    (a) => a.status.toLowerCase() === "accepted"
  );

  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Doctor Panel</h3>
        <ul>
          <li
            className={activeTab === "appointments" ? "active" : ""}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </li>
          <li
            className={activeTab === "notes" ? "active" : ""}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </li>
        </ul>
      </aside>
      <main className="dashboard-content">
        {activeTab === "appointments" && (
          <>
            <h2>Appointments</h2>
            {appointments.length === 0 ? (
              <p className="no-appointments">No appointments found.</p>
            ) : (
              <div className="appointment-list">
                {appointments.map((appt) => (
                  <div key={appt._id} className="appointment-card">
                    <div className="appointment-header">
                      <h4>{appt.userInfo}</h4>
                      <span
                        className={`status ${appt.status.toLowerCase()}`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="appointment-body">
                      <p><strong>Date:</strong> {appt.date}</p>
                      <p><strong>Time:</strong> {appt.time}</p>
                    </div>

                    {appt.status.toLowerCase() === "pending" && (
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
          </>
        )}

        {activeTab === "notes" && (
          <>
            <h2>Appointment Notes</h2>
            {acceptedAppointments.length === 0 ? (
              <p className="no-appointments">
                No accepted appointments yet.
              </p>
            ) : (
              <div className="appointment-list">
                {acceptedAppointments.map((appt) => (
                  <div key={appt._id} className="appointment-card">
                    <div className="appointment-header">
                      <h4>{appt.userInfo}</h4>
                      <span className="status accepted">Accepted</span>
                    </div>

                    <p><strong>Date:</strong> {appt.date}</p>
                    <p><strong>Time:</strong> {appt.time}</p>

                    <div className="notes-section">
                      <textarea
                        placeholder="Add or update notes..."
                        value={notesInput[appt._id] || ""}
                        onChange={(e) =>
                          setNotesInput({
                            ...notesInput,
                            [appt._id]: e.target.value,
                          })
                        }
                      />
                      <div className="note-actions">
                        <button
                          className="save-notes-btn"
                          onClick={() => handleAddNotes(appt._id)}
                        >
                          Save
                        </button>
                        <button
                          className="delete-notes-btn"
                          onClick={() => handleDeleteNotes(appt._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {appt.notes && (
                      <p className="existing-notes">
                        <strong>Existing Notes:</strong> {appt.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
