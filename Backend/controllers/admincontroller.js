import userModel from "../models/usermodel.js";
import doctorModel from "../models/doctormodel.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "./emailhelper.js";

// Get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({ success: true, data: users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Get all doctors
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({ success: true, data: doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Admin adds doctor

import moment from "moment";
import { generateSlotsForDate } from "../utils/slotutils.js"; // helper to generate 30-min slots

export const adminAddDoctorController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, timings } = req.body;

    // timings example: { morning: { from: "09:00", to: "12:00" }, evening: { from: "14:00", to: "17:00" } }

    //const existingUser = await userModel.findOne({ email });
    //if (existingUser) 
      //return res.status(200).send({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, name: `${firstName} ${lastName}`, password: hashedPassword, isDoctor: true });
    await newUser.save();

    const newDoctor = new doctorModel({
      ...req.body,
      userId: newUser._id,
      status: "approved",
      slots: [],
    });

    // Generate slots for next 7 days
    const today = moment();
    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, "days").format("DD-MM-YYYY");

      if (timings.morning) {
        const morningSlots = generateSlotsForDate(date, timings.morning.from, timings.morning.to, 30);
        newDoctor.slots.push(...morningSlots);
      }

      if (timings.evening) {
        const eveningSlots = generateSlotsForDate(date, timings.evening.from, timings.evening.to, 30);
        newDoctor.slots.push(...eveningSlots);
      }
    }

    await newDoctor.save();

    await sendEmail({
      to: email,
      subject: "Doctor Account Created",
      text: `Your doctor account is ready.\nEmail: ${email}\nPassword: ${password}`,
    });

    res.status(201).send({ success: true, message: "Doctor added successfully with slots" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Change doctor application status
export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    doctor.status = status;
    await doctor.save();

    const user = await userModel.findById(doctor.userId);
    user.notifications.push({
      type: "doctor-account-status",
      message: `Your doctor application has been ${status}`,
      onClickPath: "/doctor/profile",
    });
    await user.save();

    res.status(200).send({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
