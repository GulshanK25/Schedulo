import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/fetchAPI";
import "./Doctors.css";

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();

  // Fetch all doctors
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    const res = await fetchAPI("/doctor/getAllDoctors", "GET", {}, token);
    if (res.success) {
      setDoctors(res.data);
      setFilteredDoctors(res.data);

      // Get unique specializations
      const specs = [...new Set(res.data.map((d) => d.specialization))];
      setSpecializations(specs);
    } else alert(res.message);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors by specialization
  useEffect(() => {
    if (!selectedSpecialization) setFilteredDoctors(doctors);
    else
      setFilteredDoctors(
        doctors.filter((d) => d.specialization === selectedSpecialization)
      );
  }, [selectedSpecialization, doctors]);

  // Fetch available slots for selected doctor & date
  const fetchAvailableSlots = async (doctorId) => {
    if (!selectedDate) return alert("Select a date first!");
    const token = localStorage.getItem("token");
    const res = await fetchAPI("/user/checkAvailability", "POST", { doctorId, date: selectedDate }, token);
    if (res.success) setAvailableSlots(res.data);
    else alert(res.message);
  };

  return (
    <div className="view-doctors-page">
      <h1>Available Doctors</h1>

      <div className="filters">
        <label>
          Specialization:
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">All</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      {filteredDoctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        <div className="doctor-list">
          {filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <h2>
                Dr. {doc.firstName} {doc.lastName}
              </h2>
              <p>
                <strong>Specialization:</strong> {doc.specialization}
              </p>
              <p>
                <strong>Fees:</strong> {doc.feesPerConsultation} kr
              </p>
              <button onClick={() => fetchAvailableSlots(doc._id)}>
                Check Available Slots
              </button>

              {availableSlots.length > 0 && (
                <div className="slots">
                  <p>Select Slot:</p>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        navigate(`/book-appointment/${doc._id}`, { state: { date: selectedDate, time: slot } })
                      }
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
