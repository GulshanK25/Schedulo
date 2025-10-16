import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      required: true,
    },
    doctorInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true, 
    },
    time: {
      type: String,
      required: true, 
    },
    slotTime: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: "pending", 
    },
    notes: {
      type: String, 
      default: "",
    },
    report: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;