import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/fetchAPI";
import { AuthContext } from "../context/AuthContext";
import "./booking.css";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Convert date from yyyy-mm-dd to dd-mm-yyyy for backend
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetchAPI(`/user/doctor/${doctorId}`, "GET", null, token);
        if (res.success) setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, token]);

  // Fetch slots whenever date changes
  useEffect(() => {
    if (!date) return;
    const fetchSlots = async () => {
      try {
        const formattedDate = formatDateForBackend(date);
        const res = await fetchAPI(
          `/doctor/doctor-slots/${doctorId}?date=${formattedDate}`,
          "GET",
          null,
          token
        );
        if (res.success) setSlots(res.slots || []);
        else setSlots([]);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlots([]);
      }
    };
    fetchSlots();
    setTime("");
    setAvailability(null);
  }, [date, doctorId, token]);

  // Check slot availability
  const checkAvailability = async () => {
    if (!time) return alert("Please select a time slot first!");
    try {
      const formattedDate = formatDateForBackend(date);
      const res = await fetchAPI(
        "/user/check-availability",
        "POST",
        { doctorId, date: formattedDate, slotTime: time },
        token
      );
      setAvailability(res.success);
      alert(res.message || (res.success ? "Slot available!" : "Slot not available"));
    } catch (err) {
      console.error(err);
      alert("Error checking availability");
    }
  };

  // Book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time) return alert("Please select a time slot!");

    try {
      const formattedDate = formatDateForBackend(date);
      const res = await fetchAPI(
        "/user/book-appointment",
        "POST",
        {
          doctorId,
          userId: user._id,
          date: formattedDate,
          startTime: time,
          doctorInfo: `${doctor.firstName} ${doctor.lastName}`,
          userInfo: { name: user.name, email: user.email },
        },
        token
      );

      if (res.success) {
        alert("Appointment booked successfully! Waiting for doctor confirmation.");
        navigate("/userdashboard");
      } else {
        alert(res.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  };

  if (loading) return <p>Loading doctor details...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="booking-container">
      <h1>Book Appointment with Dr. {doctor.firstName} {doctor.lastName}</h1>

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Select Time:
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!date || slots.length === 0}
          >
            <option value="">-- Choose a Slot --</option>
            {slots.map((slot, idx) => (
              <option key={idx} value={slot.startTime} disabled={slot.booked}>
                {slot.startTime} {slot.booked ? "(Booked)" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="booking-actions">
          <button type="button" className="check-btn" onClick={checkAvailability}>
            Check Availability
          </button>
          <button type="submit" className="book-btn" disabled={availability === false}>
            Book Appointment
          </button>
        </div>

        {availability !== null && (
          <p className={`availability-message ${availability ? "available" : "unavailable"}`}>
            {availability ? "Slot is available ✅" : "Slot not available ❌"}
          </p>
        )}
      </form>
    </div>
  );
}
