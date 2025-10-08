import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainPage from "./components/mainpage";
import Login from "./pages/Login";
import Register from "./pages/register";
import LandingPage from "./pages/Dashboard"; 
import DoctorsPage from "./pages/viewdoctor";
import BookAppointment from "./pages/Booking";
import AppointmentsPage from "./pages/myappointment";
import AddDoctor from "./pages/adddoctor";
import BookingConfirmation from "./pages/bookingconfirmation";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<LandingPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/adddoctor" element={<AddDoctor />} />
          <Route path="/bookingconfirmation" element={<BookingConfirmation />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
