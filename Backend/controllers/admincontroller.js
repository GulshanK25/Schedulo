
import Doctor from "../models/doctormodel.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching users",
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
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      availability 
    } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await userModel.findOne({ email });
    let randomPassword = "Doctor123!";

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(randomPassword, salt);
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
      status: "approved",
      slots: [],
    });

    
    if (availability && Array.isArray(availability.dates)) {
      const { from = "09:00", to = "12:00", dates = [] } = availability;
      for (const d of dates) {
        const generated = generateSlotsForDate(d, from, to, 45);
        newDoctor.slots.push(...generated);
      }
    } else {
  
      const dateFormat = "DD-MM-YYYY";
      const today = moment();
      for (let i = 0; i < 7; i++) {
        const d = today.clone().add(i, "days").format(dateFormat);
        const generated = generateSlotsForDate(d, "09:00", "12:00", 45);
        newDoctor.slots.push(...generated);
      }
    }

    await newDoctor.save();


    if (randomPassword) {
      
      try {
        await sendEmail({
          to: email,
          subject: "Your doctor account created",
          text: `An account has been created for you. Email: ${email} | Password: ${randomPassword}. Please login and change your password.`,
        });
      } catch (emailErr) {
        console.error("Error sending doctor email:", emailErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: newDoctor,
    });
  } catch (error) {
    console.error("Admin add doctor error:", error);
    res.status(500).json({ success: false, message: "Error adding doctor", error });
  }
};


async function sendEmail({ to, subject, text, html = null }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}


export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({
      success: true,
      message: "Doctors data list",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching doctors data",
      error,
    });
  }
};


export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const user = await User.findById(doctor.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associated user not found",
      });
    }

   
    user.notifications.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has Been ${status}`,
      onClickPath: "/notification",
    });

    
    user.isDoctor = status === "approved";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account status updated",
      data: doctor,
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({
      success: false,
      message: "Error in account status update",
      error,
    });
  }
};

export const generateReportFromNotesController = async (req, res) => {
  try {
    const { appointmentId, reportText } = req.body;
    if (!appointmentId) return res.status(400).send({ success: false, message: "Missing appointmentId" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).send({ success: false, message: "Appointment not found" });

   
    const report = reportText && reportText.trim().length > 0 ? reportText : `Report generated from doctor's notes:\n\n${appointment.notes || "No notes provided."}`;

    appointment.report = report;
    
    appointment.status = "completed";
    await appointment.save();

    res.status(200).json({ success: true, message: "Report generated", data: appointment });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Error generating report", error });
  }
};
