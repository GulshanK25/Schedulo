import { useEffect, useState } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./doctorDashboard.css";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const doctorId = localStorage.getItem("doctorId"); 

  
  const fetchAppointments = async () => {
    const res = await fetchAPI(
      "/doctor/getDoctorAppointments",
      "POST",
      { doctorId },
      localStorage.getItem("token")
    );
    if (res.success) setAppointments(res.data);
  };

  const updateStatus = async (appointmentId, status) => {
    const res = await fetchAPI(
      "/doctor/updateAppointmentStatus",
      "POST",
      { appointmentId, status },
      localStorage.getItem("token")
    );
    if (res.success) {
      alert("Appointment updated!");
      fetchAppointments();
    } else alert(res.message);
  };

  const submitNote = async () => {
    const res = await fetchAPI(
      "/doctor/addAppointmentNote",
      "POST",
      { appointmentId: selected._id, note },
      localStorage.getItem("token")
    );
    if (res.success) {
      alert("Note added successfully!");
      setNote("");
      setSelected(null);
      fetchAppointments();
    } else alert(res.message);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>

      <div className="appointments-section">
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.userInfo}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(appt._id, "confirmed")}
                          className="approve-btn"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, "rejected")}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appt.status === "confirmed" && (
                      <button
                        onClick={() => setSelected(appt)}
                        className="note-btn"
                      >
                        Add Note
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="note-popup">
          <div className="note-content">
            <h3>Add Note for {selected.userInfo}</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your notes here..."
            ></textarea>
            <div className="popup-actions">
              <button onClick={submitNote}>Submit</button>
              <button onClick={() => setSelected(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
