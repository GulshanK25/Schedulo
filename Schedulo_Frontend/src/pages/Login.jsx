import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/fetchAPI";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAPI("/user/login", "POST", { email, password });
      if (res.success) {
        const token = res.token;
        localStorage.setItem("token", token);
        const userRes = await fetchAPI("/user/getUserData", "POST", {}, token);
       if (userRes.success) {
  const userData = userRes.data;
  let role = "user";
  if (userData.isAdmin) role = "admin";
  else if (userData.isDoctor) role = "doctor";
  setUser(userData);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userData._id);
  if (role === "doctor") localStorage.setItem("doctorId", userData._id);
  if (role === "admin") navigate("/admin/dashboard");
  else if (role === "doctor") navigate("/doctor/dashboard");
  else navigate("/user/dashboard");
} else {
  alert(userRes.message);
}}
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
