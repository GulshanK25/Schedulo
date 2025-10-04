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
