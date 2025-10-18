// File: Backend/controllers/doctorcontroller_test.cjs
const Doctor = require("../models/doctormodel.cjs");
const Appointment = require("../models/appointmentmodel.cjs");
const User = require("../models/usermodel.cjs");

// ✅ Get Doctor Info
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctor info", error });
  }
};

// ✅ Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctors", error });
  }
};

// ✅ Update Profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body, { new: true });
    res.status(200).json({ success: true, message: "Profile updated", data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error });
  }
};

// ✅ Get Doctor By ID
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctor by ID", error });
  }
};

// ✅ Doctor Appointments
const doctorAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.body.doctorId });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error });
  }
};

// ✅ Update Appointment Status
const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating appointment status", error });
  }
};

// ✅ Add Doctor (for testing purpose)
const addDoctorController = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding doctor", error });
  }
};

module.exports = {
  getDoctorInfoController,
  getAllDoctors,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  addDoctorController,
};
