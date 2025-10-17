import express from "express";
import {
  bookAppointmentController,
  bookingAvailabilityController
} from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Book appointment
router.post("/book", authMiddleware, bookAppointmentController);

// Check availability
router.post("/availability", authMiddleware, bookingAvailabilityController);

export default router;
