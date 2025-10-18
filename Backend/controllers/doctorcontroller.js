import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";
import mongoose from "mongoose";
import { sendEmail } from "./emailhelper.js";


export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.userId });
    if (!doctor)
      return res.status(404).send({ success: false, message: "Doctor not found" });

    res.status(200).send({
      success: true,
      message: "Doctor profile fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor profile",
      error,
    });
  }
};


export const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body, { new: true });
    res.status(200).send({ success: true, message: "Profile updated", data: doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating profile", error });
  }
};


export const doctorAppointmentsController = async (req, res) => {
  try {
    
    const doctor = await doctorModel.findOne({ userId: req.userId });
    if (!doctor)
      return res.status(404).send({ success: false, message: "Doctor not found" });

    const appointments = await appointmentModel
      .find({ doctorId: doctor._id })
      .populate("userId", "name email phone")
      .sort({ date: 1 });

    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
      error,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, action } = req.body;
    if (!appointmentId || !action)
      return res.status(400).send({ success: false, message: "Missing fields" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.status(404).send({ success: false, message: "Appointment not found" });

    appointment.status =
      action.toLowerCase() === "accept" ? "Accepted" : "Rejected";
    await appointment.save();

    const user = await userModel.findById(appointment.userId);
    if (user) {
      user.notifications.push({
        type: "appointment-status-update",
        message: `Your appointment on ${appointment.date} was ${appointment.status.toLowerCase()}.`,
        onClickPath: "/user/appointments",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${appointment.status.toLowerCase()} successfully`,
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).send({
      success: false,
      message: "Error updating appointment status",
      error,
    });
  }
};

export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addNotesController = async (req, res) => {
  try {
    const { appointmentId, notes } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { notes }, { new: true });
    res.status(200).send({ success: true, message: "Notes added", data: appointment });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error adding notes", error });
  }
};

export const getDoctorSlotsController = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; 

    if (!date) return res.status(400).send({ success: false, message: "Date is required" });

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    
    const slotsForDate = doctor.slots
      .filter((s) => s.date === date)
      .map((s) => ({ startTime: s.startTime, endTime: s.endTime, booked: s.booked || false }));

    res.status(200).send({ success: true, slots: slotsForDate });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching slots", error });
  }
};