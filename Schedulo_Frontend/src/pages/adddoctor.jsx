import React, { useState } from "react";
import { fetchAPI } from "../api/fetchAPI";
import "./adddoctor.css";

export default function AddDoctor() {
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    specialization: "",
    experience: "",
    feesPerConsultation: "",
    timings: {
      morning: { from: "", to: "" },
      evening: { from: "", to: "" },
    },
    address: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.timing && dataset.period) {
      setDoctor({
        ...doctor,
        timings: {
          ...doctor.timings,
          [dataset.period]: { ...doctor.timings[dataset.period], [dataset.timing]: value },
        },
      });
    } else {
      setDoctor({ ...doctor, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetchAPI("/admin/add-doctor", "POST", doctor,token );
      if (res.success) {
        alert("Doctor added successfully!");
        setDoctor({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          specialization: "",
          experience: "",
          feesPerConsultation: "",
          timings: { morning: { from: "", to: "" }, evening: { from: "", to: "" } },
          address: "",
          website: "",
        });
      } else {
        alert("Error: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-doctor-container">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} className="doctor-form">
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
        <input name="experience" placeholder="Experience" onChange={handleChange} required />
        <input name="feesPerConsultation" type="number" placeholder="Fees per Consultation" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="website" placeholder="Website" onChange={handleChange} />

        <div className="timings-group">
          <h3>Morning Timings</h3>
          <input
            type="time"
            placeholder="From"
            data-timing="from"
            data-period="morning"
            value={doctor.timings.morning.from}
            onChange={handleChange}
          />
          <input
            type="time"
            placeholder="To"
            data-timing="to"
            data-period="morning"
            value={doctor.timings.morning.to}
            onChange={handleChange}
          />
        </div>

        <div className="timings-group">
          <h3>Evening Timings</h3>
          <input
            type="time"
            placeholder="From"
            data-timing="from"
            data-period="evening"
            value={doctor.timings.evening.from}
            onChange={handleChange}
          />
          <input
            type="time"
            placeholder="To"
            data-timing="to"
            data-period="evening"
            value={doctor.timings.evening.to}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}
