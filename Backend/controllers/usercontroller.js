import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import userModel from "../models/usermodels.js";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";


export const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser)
      return res
        .status(200)
        .send({ message: "User already exists", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: `Register error: ${error.message}` });
  }
};


export const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user)
      return res.status(200).send({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).send({ message: "Login successful", success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Login error: ${error.message}` });
  }
};


export const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    if (!user)
      return res.status(404).send({ message: "User not found", success: false });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Auth error", success: false, error });
  }
};


export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notifications = adminUser.notifcation || [];
    notifications.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: { doctorId: newDoctor._id },
      onClickPath: "/admin/doctors",
    });

    adminUser.notifcation = notifications;
    await adminUser.save();

    res.status(201).send({
      success: true,
      message: "Doctor application submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error applying for doctor", error });
  }
};


export const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.seennotification.push(...user.notifcation);
    user.notifcation = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching notifications", error });
  }
};


export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notifcation = [];
    user.seennotification = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error deleting notifications", error });
  }
};


export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching doctors", error });
  }
};


export const bookAppointmentController = async (req, res) => {
  try {
    const formattedDate = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const formattedTime = moment(req.body.time, "HH:mm").toISOString();

    const newAppointment = new appointmentModel({
      ...req.body,
      date: formattedDate,
      time: formattedTime,
      status: "pending",
    });
    await newAppointment.save();

    const doctor = await userModel.findById(req.body.doctorInfo.userId);
    doctor.notifcation.push({
      type: "new-appointment-request",
      message: `New appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error booking appointment", error });
  }
};


export const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const appointments = await appointmentModel.find({
      doctorId: req.body.doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Appointments not available at this time",
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointments available",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error checking availability", error });
  }
};

// ✅ Get user's appointments
export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching appointments", error });
  }
};
