import React, { useState } from "react";
import { fetchAPI } from "../api/fetchAPI";

export default function AddDoctor() {
  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    experience: "",
    feesPerConsultation: "",
    timings: { morning: "", evening: "" },
    address: "",
    website: "",
    userId: "temp"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "morning" || name === "evening") {
      setDoctor({...doctor, timings: {...doctor.timings, [name]: value}});
    } else {
      setDoctor({...doctor, [name]: value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAPI("/doctor/add", "POST", doctor);
      if(res.success) alert("Doctor added!");
      else alert("Error: " + res.message);
    } catch(err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="First Name" name="firstName" onChange={handleChange} required />
        <input placeholder="Last Name" name="lastName" onChange={handleChange} required />
        <input placeholder="Email" name="email" onChange={handleChange} required />
        <input placeholder="Phone Number" name="phoneNumber" onChange={handleChange} required />
        <input placeholder="Specialization" name="specialization" onChange={handleChange} required />
        <input placeholder="Experience" name="experience" onChange={handleChange} required />
        <input placeholder="Fees" name="feesPerConsultation" type="number" onChange={handleChange} required />
        <input placeholder="Address" name="address" onChange={handleChange} required />
        <input placeholder="Website" name="website" onChange={handleChange} />
        <input placeholder="Morning Timings" name="morning" onChange={handleChange} />
        <input placeholder="Evening Timings" name="evening" onChange={handleChange} />
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
}
