import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  adminAddDoctorController,
  generateReportFromNotesController,
} from "../controllers/admincontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);
router.post("/add-doctor", authMiddleware, adminAddDoctorController);
router.post("/generate-report", authMiddleware, generateReportFromNotesController);

export default router;
