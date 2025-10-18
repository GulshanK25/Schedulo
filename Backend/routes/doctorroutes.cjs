// File: Backend/routes/doctorroutes.cjs
const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  addDoctorController,
  getAllDoctors,
} = require("../controllers/doctorcontroller_test.cjs");

const router = express.Router();

router.post("/getDoctorInfo", getDoctorInfoController);
router.get("/getAllDoctors", getAllDoctors);
router.post("/add", addDoctorController);
router.post("/updateProfile", updateProfileController);
router.post("/getDoctorById", getDoctorByIdController);
router.post("/doctor-appointments", doctorAppointmentsController);
router.post("/update-status", updateStatusController);

module.exports = router;
