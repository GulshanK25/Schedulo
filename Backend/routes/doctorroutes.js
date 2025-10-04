import express from "express";
import {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} from "../controllers/doctorcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);


router.post("/updateProfile", authMiddleware, updateProfileController);


router.post("/getDoctorById", authMiddleware, getDoctorByIdController);


router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);


router.post("/update-status", authMiddleware, updateStatusController);

export default router;
