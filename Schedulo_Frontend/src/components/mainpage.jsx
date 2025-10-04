import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./mainpage.css";

export default function MainPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="mainpage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Schedulo
        </div>
        <div className="nav-buttons">
          {!user ? (
            <>
              <button className="nav-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="nav-btn" onClick={() => navigate("/register")}>
                Register
              </button>
            </>
          ) : (
            <>
              <span className="welcome">Hello, {user.name}</span>
              <button className="nav-btn" onClick={() => navigate("/user-dashboard")}>
                Dashboard
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <p className="tagline">Healthcare Made Simple</p>
        <h1>Book Your Doctor Appointment Today</h1>
        <p className="subtext">
          Connect with qualified healthcare professionals instantly. Easy booking, trusted doctors, better health outcomes.
        </p>
      </section>
    </div>
  );
}
