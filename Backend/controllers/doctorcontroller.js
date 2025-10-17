import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";
import mongoose from "mongoose";
import { sendEmail } from "./emailhelper.js";


export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({ success: true, message: "Doctor profile fetched", data: doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching doctor profile", error });
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
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({ success: true, message: "Appointments fetched", data: appointments });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching appointments", error });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).send({ success: false, message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    const patient = await userModel.findById(appointment.userId);
    patient.notifications.push({
      type: "appointment-status-updated",
      message: `Your appointment with Dr. ${appointment.doctorInfo} is now ${status}`,
      onClickPath: "/appointments",
    });
    await patient.save();

    await sendEmail({
      to: patient.email,
      subject: "Appointment Status Updated",
      text: `Your appointment with Dr. ${appointment.doctorInfo} is now ${status}`,
    });

    res.status(200).send({ success: true, message: "Appointment status updated", data: appointment });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating status", error });
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
