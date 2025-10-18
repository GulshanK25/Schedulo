// File: Backend/routes/userroutes.cjs
const express = require("express");
const {
  registerController,
  loginController,
  authController,
} = require("../controllers/usercontroller.cjs"); // only the 3 implemented controllers

const router = express.Router();

// 🧩 Testable Endpoints
router.post("/register", registerController);      // Register new user
router.post("/login", loginController);            // User login
router.post("/getUserData", authController);       // Fetch user data

// You can later re-enable these once you convert them to CommonJS:
// router.post("/apply-doctor", applyDoctorController);
// router.post("/get-all-notification", getAllNotificationController);
// router.post("/delete-all-notification", deleteAllNotificationController);
// router.post("/book-appointment", bookAppointmentController);
// router.post("/booking-availability", bookingAvailabilityController);
// router.get("/user-appointments", userAppointmentsController);

module.exports = router;
