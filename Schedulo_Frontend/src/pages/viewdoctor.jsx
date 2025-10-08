import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctor.css";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/v1/doctor/getAllDoctors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) setDoctors(data.data);
        else alert(data.message);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctors-page">
      <h1 className="page-title">Available Doctors</h1>
      {doctors.length === 0 ? (
        <p className="no-data">No doctors available.</p>
      ) : (
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <h2>{doc.firstName} {doc.lastName}</h2>
              <p><strong>Specialization:</strong> {doc.specialization}</p>
              <p><strong>Fees:</strong> {doc.feesPerConsultation} krones</p>
              <button
                className="book-btn"
                onClick={() => navigate(`/book-appointment/${doc._id}`)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
