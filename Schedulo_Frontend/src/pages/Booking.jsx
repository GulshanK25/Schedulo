import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/fetchAPI";
import { AuthContext } from "../context/AuthContext";
import "./booking.css";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetchAPI("/doctor/getDoctorById", "POST", { doctorId }, localStorage.getItem("token"));
      if (res.success) setDoctor(res.data);
      else alert(res.message);
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAPI("/user/book-appointment", "POST", {
        userId: user._id,
        doctorId,
        doctorInfo: `${doctor.firstName} ${doctor.lastName}`,
        userInfo: user.name,
        date,
        time
      }, localStorage.getItem("token"));
      if (res.success) {
        alert("Appointment booked successfully!");
        navigate("/appointments");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="booking-container">
      <h1>Book Appointment with Dr. {doctor.firstName} {doctor.lastName}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>
        <label>
          Time:
          <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
        </label>
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
