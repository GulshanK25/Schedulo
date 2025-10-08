import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentmodel.js";
import userModel from "../models/usermodel.js";


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


export const addDoctorController = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newDoctor = new doctorModel({
      userId: userId || "temporary-user-id", // for now, use dummy userId
      firstName,
      lastName,
      phoneNumber,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
      status: "approved",
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor added successfully!",
      data: newDoctor,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error adding doctor",
      error,
    });
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


export const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    const user = await userModel.findById(appointment.userId);
    const notifications = user.notifcation || [];
    notifications.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/doctor-appointments",
    });

    user.notifcation = notifications;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating appointment status",
      error,
    });
  }
};
