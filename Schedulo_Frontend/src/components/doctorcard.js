import React from "react";
import "./DoctorCard.css";

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <img src={doctor.image} alt={doctor.name} />
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p className="specialty">{doctor.specialty}</p>
        <p>{doctor.location}</p>
        <p>{doctor.experience}+ years experience</p>
        <div className="rating">
          ⭐ {doctor.rating} ({doctor.reviews})
        </div>
        {doctor.available && <span className="available">Available Today</span>}
      </div>
      <button className="book-btn">Book Appointment</button>
    </div>
  );
}

export default DoctorCard;