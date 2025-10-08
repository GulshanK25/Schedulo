import { useNavigate } from "react-router-dom";
import "./bookingConfirmation.css";

export default function BookingConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1>Appointment Confirmed!</h1>
        <p>Your appointment has been successfully booked.</p>
        <button onClick={() => navigate("/doctors")}>Back to Doctors</button>
      </div>
      
    </div>
  );
}
