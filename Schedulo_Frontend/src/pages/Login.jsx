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
        localStorage.setItem("token", res.token);
        const userData = await fetchAPI("/user/getUserData", "POST", {}, res.token);
        setUser(userData.data);
        navigate("/user-dashboard");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
