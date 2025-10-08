import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function LandingPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1>Welcome to <span>Schedulo</span></h1>
        <p className="greeting">
          {user ? `Hi ${user.name}, ready to manage your appointments?` : "Welcome to your smart healthcare portal."}
        </p>

        <div className="landing-buttons">
          <button onClick={() => navigate("/appointments")}>Book Appointment</button>
          <button onClick={() => navigate("/doctors")}>View Doctors</button>
          {user && <button className="logout-btn" onClick={logout}>Logout</button>}
        </div>
      </div>
    </div>
  );
}
