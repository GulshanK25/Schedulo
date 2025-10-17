import express from "express";
import {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  getUserDataController
} from "../controllers/usercontroller.js";
import { getDoctorByIdController } from "../controllers/doctorcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/auth", authMiddleware, authController);
router.get("/doctors", authMiddleware, getAllDoctorsController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/getUserData", getUserDataController);
router.get("/doctor/:id", authMiddleware, getDoctorByIdController);
router.post("/book-appointment", authMiddleware, bookAppointmentController);
router.post("/check-availability", authMiddleware, bookingAvailabilityController);
router.get("/appointments", authMiddleware, userAppointmentsController);
router.get("/notifications", authMiddleware, getAllNotificationController);
router.delete("/notifications", authMiddleware, deleteAllNotificationController);

export default router;
