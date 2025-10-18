import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import userModel from "../models/usermodel.js";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";

export const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(200).send({ message: "User already exists", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: `Register error: ${error.message}` });
  }
};


export const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(200).send({ message: "Invalid email or password", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).send({ message: "Login successful", success: true, token });
  } catch (error) {
    res.status(500).send({ message: `Login error: ${error.message}`, success: false });
  }
};


export const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).send({ message: "User not found", success: false });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ message: "Auth error", success: false });
  }
};


export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({ success: true, message: "Doctors fetched successfully", data: doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching doctors", error });
  }
};

export const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId); 
    if (!user) return res.status(404).send({ success: false, message: "User not found" });


    user.seennotification = user.seennotification || [];
    user.seennotification.push(...user.notifcation);
    user.notifcation = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user.seennotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching notifications", error });
  }
};

export const deleteAllNotificationController = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    user.notifications = [];
    await user.save();

    res.status(200).send({ success: true, message: "All notifications deleted" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getUserDataController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching user data", error });
  }
};

export const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, userId, userInfo, date, startTime, doctorInfo } = req.body;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    // Use startTime from request body
    const slot = doctor.slots.find(s => s.date === date && s.startTime === startTime);

    if (!slot || slot.status !== "available") {
  return res.status(400).send({ success: false, message: "Slot not available" });
}


slot.status = "pending";

    const appointment = new appointmentModel({
      doctorId,
      userId,
      doctorInfo,
      userInfo,
      date,
      time: startTime,
      slotTime: startTime,
      status: "pending",
    });

    await appointment.save();
    await doctor.save(); 

    const doctorUser = await userModel.findById(doctor.userId);
    doctorUser.notifications.push({
      type: "new-appointment-request",
      message: `New appointment request from ${userInfo}`,
      onClickPath: "/doctor/appointments",
    });
    await doctorUser.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully! Awaiting doctor's confirmation.",
      data: appointment,
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).send({ success: false, message: "Booking error", error });
  }
};

export const bookingAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, slotTime } = req.body;
    if (!doctorId || !date) return res.status(400).send({ success: false, message: "Missing doctorId or date" });

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    if (slotTime) {
      const slot = doctor.slots.find(s => s.date === date && s.startTime === slotTime);
      if (!slot) return res.status(200).send({ success: false, message: "No such slot" });
      return res.status(200).send({ success: true, message: slot.booked ? "Slot booked" : "Slot available" });
    } else {
      const available = doctor.slots.filter(s => s.date === date && !s.booked).map(s => ({ startTime: s.startTime, endTime: s.endTime }));
      return res.status(200).send({ success: true, data: available });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error checking availability", error });
  }
};


export const userAppointmentsController = async (req, res) => {
  try {
    // Ensure auth middleware sets req.userId
    const userId = req.userId;
    if (!userId)
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized" });

    // Fetch appointments for this user
    const appointments = await appointmentModel
      .find({ userId })
      .populate({
        path: "doctorId",
        select: "firstName lastName specialization",
      })
      .sort({ date: -1 }); // latest first
    const formattedAppointments = appointments.map((apt) => ({
      _id: apt._id,
      date: apt.date,
      time: apt.time || apt.slotTime,
      status: apt.status,
      doctorName: apt.doctorId
        ? `Dr. ${apt.doctorId.firstName} ${apt.doctorId.lastName}`
        : "Doctor info unavailable",
      doctorSpecialization: apt.doctorId?.specialization || "",
    }));

    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: formattedAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};



export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    adminUser.notifications = adminUser.notifications || [];
    adminUser.notifications.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: { doctorId: newDoctor._id },
      onClickPath: "/admin/doctors",
    });
    await adminUser.save();

    res.status(201).send({ success: true, message: "Doctor application submitted" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error applying for doctor", error });
  }
};
