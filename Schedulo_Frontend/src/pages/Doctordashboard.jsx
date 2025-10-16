import { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState({}); // store notes per appointment

  // Fetch doctor's appointments
  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetchAPI("/doctor/appointments", "POST", { userId: localStorage.getItem("userId") }, token);
    if (res.success) setAppointments(res.data);
    else alert(res.message);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Confirm or reject appointment
  const handleStatusUpdate = async (apptId, status) => {
    const token = localStorage.getItem("token");
    const res = await fetchAPI("/doctor/updateStatus", "POST", { appointmentsId: apptId, status }, token);
    if (res.success) {
      alert(`Appointment ${status}`);
      fetchAppointments();
    } else alert(res.message);
  };

  // Add notes
  const handleAddNotes = async (apptId) => {
    const token = localStorage.getItem("token");
    const note = notes[apptId];
    if (!note) return alert("Please enter notes first");
    const res = await fetchAPI("/doctor/addNotes", "POST", { appointmentId: apptId, notes: note }, token);
    if (res.success) {
      alert("Notes added successfully");
      setNotes((prev) => ({ ...prev, [apptId]: "" }));
    } else alert(res.message);
  };

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <div className="appointment-card" key={appt._id}>
              <p><strong>Patient:</strong> {appt.userInfo}</p>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Status:</strong> {appt.status}</p>

              {appt.status === "pending" && (
                <div className="actions">
                  <button onClick={() => handleStatusUpdate(appt._id, "confirmed")}>Confirm</button>
                  <button onClick={() => handleStatusUpdate(appt._id, "rejected")}>Reject</button>
                </div>
              )}

              <div className="notes-section">
                <textarea
                  placeholder="Add notes here..."
                  value={notes[appt._id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [appt._id]: e.target.value }))
                  }
                />
                <button onClick={() => handleAddNotes(appt._id)}>Save Notes</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
