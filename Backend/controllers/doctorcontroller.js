import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";
import moment from "moment";
import { generateSlotsForDate } from "../utils/slotutils.js";
import { sendEmail } from "./emailhelper.js"


export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor details",
      error,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body; // status: 'accepted' | 'rejected' | 'completed'
    if (!appointmentId || !status) return res.status(400).send({ success: false, message: "Missing fields" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).send({ success: false, message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    const patient = await userModel.findById(appointment.userId);
    const doctor = await doctorModel.findById(appointment.doctorId);

    // Notify patient in-app
    if (patient) {
      patient.notifications = patient.notifications || [];
      patient.notifications.push({
        type: "status-updated",
        message: `Your appointment status has been updated to ${status}`,
        onClickPath: "/user/appointments",
      });
      await patient.save();
    }

    if (status === "accepted") {
      // send email confirmation to patient
      try {
        await sendEmail({
          to: patient.email,
          subject: "Appointment confirmed",
          text: `Your appointment with Dr. ${doctor.firstName} ${doctor.lastName} is confirmed on ${appointment.date} at ${appointment.slotTime}.`,
        });
      } catch (err) {
        console.error("Email error:", err);
      }
    } else if (status === "rejected") {
      // free slot: set booked=false and appointmentId=null
      await doctorModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(appointment.doctorId),
          "slots.date": appointment.date,
          "slots.startTime": appointment.slotTime,
        },
        {
          $set: { "slots.$.booked": false, "slots.$.appointmentId": null },
        }
      );
    }

    res.status(200).send({ success: true, message: "Status updated", data: appointment });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send({ success: false, message: "Error updating status", error });
  }
};

export const addNotesController = async (req, res) => {
  try {
    const { appointmentId, notes } = req.body;
    if (!appointmentId) return res.status(400).send({ success: false, message: "Missing appointmentId" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).send({ success: false, message: "Appointment not found" });

    appointment.notes = notes || "";
    // optionally set appointment to completed or keep status as 'accepted'
    await appointment.save();

    res.status(200).send({ success: true, message: "Notes added", data: appointment });
  } catch (error) {
    console.error("Error adding notes:", error);
    res.status(500).send({ success: false, message: "Error adding notes", error });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).send({
      success: true,
      message: "All doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
      error,
    });
  }
};


export const adminAddDoctorController = async (req, res) => {
  try {
    
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      website = "",
      address,
      specialization,
      experience,
      feesPerConsultation,
      availability,
    } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    
    let user = await userModel.findOne({ email });
    let rawPassword = null;
    if (!user) {
      rawPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(rawPassword, salt);
      user = new userModel({
        name: `${firstName} ${lastName}`,
        email,
        password: hashed,
        isDoctor: true,
      });
      await user.save();
    } else {
      user.isDoctor = true;
      await user.save();
    }

   
    const newDoctor = new doctorModel({
      userId: user._id.toString(),
      firstName,
      lastName,
      phoneNumber,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings: availability?.timings || {},
      slots: [],
      status: "approved",
    });

    
    if (availability && Array.isArray(availability.dates) && availability.dates.length > 0) {
      const from = availability.from || "09:00";
      const to = availability.to || "12:00";
      for (const d of availability.dates) {
        const generated = generateSlotsForDate(d, from, to, 45);
        newDoctor.slots.push(...generated);
      }
    } else {
      
      for (let i = 0; i < 7; i++) {
        const d = moment().add(i, "days").format("DD-MM-YYYY");
        const generated = generateSlotsForDate(d, "09:00", "12:00", 45);
        newDoctor.slots.push(...generated);
      }
    }

    await newDoctor.save();

    
    if (rawPassword) {
      try {
        await sendEmail({
          to: email,
          subject: "Your doctor account created",
          text: `Your doctor account has been created.\nEmail: ${email}\nPassword: ${rawPassword}\nPlease login and change your password.`,
        });
      } catch (err) {
        console.error("Email error", err);
      }
    }

    res.status(201).json({
      success: true,
      message: "Doctor created and slots generated",
      data: newDoctor,
    });
  } catch (error) {
    console.error("Admin add doctor error:", error);
    res.status(500).json({ success: false, message: "Error adding doctor", error });
  }
};


export const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error,
    });
  }
};


export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor info",
      error,
    });
  }
};

export const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor appointments",
      error,
    });
  }
};




export const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, userInfo, userId, desiredStartTime } = req.body;
    if (!doctorId || !desiredStartTime || !userId) {
      return res.status(400).send({ success: false, message: "Missing required fields" });
    }

    // normalize desiredStartTime to ISO
    const desiredStart = moment(desiredStartTime, moment.ISO_8601, true).isValid()
      ? moment(desiredStartTime)
      : moment(desiredStartTime, "DD-MM-YYYY HH:mm");

    if (!desiredStart.isValid()) {
      return res.status(400).send({ success: false, message: "Invalid desiredStartTime" });
    }

    // locate doctor and slot
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    // find slot matching startTime on doctor.slots
    const matchIndex = doctor.slots.findIndex(slot => {
      return moment(slot.startTime).toISOString() === desiredStart.toISOString();
    });

    if (matchIndex === -1) {
      return res.status(200).send({ success: false, message: "No slot available at this time" });
    }

    const slot = doctor.slots[matchIndex];
    if (slot.booked) {
      return res.status(200).send({ success: false, message: "Slot already booked" });
    }

    // create appointment (pending)
    const newAppointment = new appointmentModel({
      doctorId,
      userId,
      userInfo,
      date: moment(slot.date).toISOString(),
      time: slot.startTime,
      status: "pending",
    });
    await newAppointment.save();

    // notify doctor user (push to notifications)
    const docUser = await userModel.findById(doctor.userId);
    docUser.notifications = docUser.notifications || [];
    docUser.notifications.push({
      type: "new-appointment-request",
      message: `New appointment request from ${userInfo.name}`,
      onClickPath: "/doctor/appointments",
      data: { appointmentId: newAppointment._id },
    });
    await docUser.save();

    // respond
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
