import React, { useEffect, useState } from "react";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  // ✅ Safely load user from localStorage (prevent null issues)
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Invalid user object in localStorage");
  }

  useEffect(() => {
    const getAppointments = async () => {
      // ✅ Guard clause - prevents Jest crashes or null access
      if (!user || !user._id) {
        console.warn("No user found, skipping appointment fetch.");
        return;
      }

      try {
        const res = await fetch(`/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    getAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a._id}>
              <strong>{a.doctorName}</strong> — {a.date} at {a.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointment;
