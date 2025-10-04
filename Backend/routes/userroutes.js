import express from "express";
import {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} from "../controllers/usercontroller.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/register", registerController);


router.post("/login", loginController);


router.post("/getUserData", authMiddleware, authController);


router.post("/apply-doctor", authMiddleware, applyDoctorController);


router.post("/get-all-notification", authMiddleware, getAllNotificationController);


router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

//router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);


router.post("/book-appointment", authMiddleware, bookAppointmentController);


router.post("/booking-availability", authMiddleware, bookingAvailabilityController);


router.get("/user-appointments", authMiddleware, userAppointmentsController);

export default router;
