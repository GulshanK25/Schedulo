// File: Backend/models/doctormodel.cjs
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    address: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    feesPerConsultation: { type: Number, required: true },
    timings: { type: Object, required: true },
    notifications: { type: Array, default: [] },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
