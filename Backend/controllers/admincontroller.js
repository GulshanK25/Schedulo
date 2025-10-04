
import Doctor from "../models/doctormodel.js";
import User from "../models/usermodel.js";

// Get all users
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
