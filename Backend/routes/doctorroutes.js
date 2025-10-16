import express from "express";
import {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  getAllDoctors,
  addNotesController,
} from "../controllers/doctorcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);
router.get("/getAllDoctors", getAllDoctors);
//router.post("/add", addDoctorController);
router.post("/updateProfile", authMiddleware, updateProfileController);
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);
router.post("/update-status", authMiddleware, updateStatusController);
router.put("/add-notes", authMiddleware, addNotesController);
router.post("/appointments", authMiddleware, doctorAppointmentsController);
export default router;
