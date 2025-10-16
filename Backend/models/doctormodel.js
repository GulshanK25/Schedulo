import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String, 
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointments",
    default: null,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
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
    slots: {
      type: [slotSchema],
      default: [],
    },
    notifications: { type: Array, default: [] },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;