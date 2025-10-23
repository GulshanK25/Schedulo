// backend/controllers/appointmentController.js
import moment from "moment";
import appointmentModel from "../models/appointmentmodel.js";
import doctorModel from "../models/doctormodel.js";
import userModel from "../models/usermodel.js";
import { sendEmail } from "./emailhelper.js";
import mongoose from "mongoose";


export const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, userId, userInfo, date, slotTime } = req.body;
    
    if (!doctorId || !userId || !date || !slotTime) {
      return res.status(400).send({ success: false, message: "Missing required fields" });
    }

   
    const doctorUpdate = await doctorModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(doctorId),
        slots: { $elemMatch: { date, startTime: slotTime, booked: false } },
      },
      { $set: { "slots.$.booked": true } },
      { new: true }
    );

    if (!doctorUpdate) {
      return res.status(200).send({ success: false, message: "Slot not available or already booked" });
    }

    
    const newAppointment = new appointmentModel({
      doctorId,
      userId,
      userInfo: typeof userInfo === "string" ? userInfo : JSON.stringify(userInfo),
      doctorInfo: `${doctorUpdate.firstName} ${doctorUpdate.lastName}`,
      date,
      time: slotTime,
      slotTime,
      status: "pending",
    });

    await newAppointment.save();

    
    await doctorModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(doctorId),
        "slots.date": date,
        "slots.startTime": slotTime,
      },
      {
        $set: { "slots.$.appointmentId": newAppointment._id },
      }
    );

    
    const doctorUser = await userModel.findById(doctorUpdate.userId);
    if (doctorUser) {
      doctorUser.notifications = doctorUser.notifications || [];
      doctorUser.notifications.push({
        type: "new-appointment-request",
        message: `New appointment request from ${typeof userInfo === "string" ? JSON.parse(userInfo).name || "Patient" : userInfo.name || "Patient"}`,
        onClickPath: "/doctor/appointments",
        data: { appointmentId: newAppointment._id },
      });
      await doctorUser.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment requested successfully. Waiting doctor approval.",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send({ success: false, message: "Error booking appointment", error });
  }
};

export const bookingAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, slotTime } = req.body; 
    if (!doctorId || !date) {
      return res.status(400).send({ success: false, message: "Missing doctorId or date" });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    if (slotTime) {
      const slot = doctor.slots.find(s => s.date === date && s.startTime === slotTime);
      if (!slot) {
        return res.status(200).send({ success: false, message: "No such slot" });
      }
      return res.status(200).send({ success: true, message: slot.booked ? "Slot booked" : "Slot available" });
    } else {
     
      const available = doctor.slots.filter(s => s.date === date && !s.booked).map(s => ({ startTime: s.startTime, endTime: s.endTime }));
      return res.status(200).send({ success: true, data: available });
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).send({ success: false, message: "Error checking availability", error });
  }
};