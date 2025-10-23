import userModel from "../models/usermodel.js";
import doctorModel from "../models/doctormodel.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "./emailhelper.js";


export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({ success: true, data: users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    if (userId === req.userId) {
      return res.status(400).send({ 
        success: false, 
        message: "You cannot delete your own account" 
      });
    }

    if (user.isDoctor) {
      await doctorModel.findOneAndDelete({ userId: userId });
    }
    await userModel.findByIdAndDelete(userId);

    res.status(200).send({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    res.status(500).send({ 
      success: false, 
      message: error.message 
    });
  }
};


export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({ success: true, data: doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};


import moment from "moment";
import { generateSlotsForDate } from "../utils/slotutils.js"; 

export const adminAddDoctorController = async (req, res) => {
  try {
    const { email, password, firstName, lastName, timings } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, name: `${firstName} ${lastName}`, password: hashedPassword, isDoctor: true });
    await newUser.save();

    const newDoctor = new doctorModel({
      ...req.body,
      userId: newUser._id,
      status: "approved",
      slots: [],
    });

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
    res.status(201).send({ success: true, message: "Doctor added successfully with slots" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};


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
