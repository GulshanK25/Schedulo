// File: Backend/models/appointmentmodel.cjs
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctors", required: true },
    doctorInfo: { type: String, required: true },
    userInfo: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "pending" },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
