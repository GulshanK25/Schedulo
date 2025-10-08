import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAPI } from "../api/fetchAPI";
import "./appointment.css";

export default function AppointmentsPage() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await fetchAPI("/user/getAppointments", "POST", { userId: user._id }, localStorage.getItem("token"));
      if (res.success) setAppointments(res.data);
      else alert(res.message);
    };
    fetchAppointments();
  }, [user]);

  return (
    <div>
      <h1>My Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              <p>Doctor: {appt.doctorInfo}</p>
              <p>Date: {appt.date}</p>
              <p>Time: {appt.time}</p>
              <p>Status: {appt.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
