import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewDoctors from "./pages/viewdoctor";
import AppointmentsPage from "./pages/myappointment";
import AddDoctor from "./pages/adddoctor";
import DoctorDashboard from "./pages/Doctordashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import BookAppointment from "./pages/Booking";
import MainPage from "./components/mainpage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctors" element={<ViewDoctors />} />
      <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-doctor" element={<AddDoctor />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
    </Routes>
  );
}

export default App;
