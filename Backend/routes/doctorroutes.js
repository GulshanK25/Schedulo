import express from "express";
import {
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
  updateStatusController,
  addNotesController
} from "../controllers/doctorcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getDoctorInfoController);
router.put("/profile", authMiddleware, updateProfileController);

router.get("/appointments", authMiddleware, doctorAppointmentsController);
router.put("/appointments/status", authMiddleware, updateStatusController);
router.put("/appointments/notes", authMiddleware, addNotesController);

export default router;
