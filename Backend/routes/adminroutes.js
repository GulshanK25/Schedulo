import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  adminAddDoctorController,
  changeAccountStatusController
} from "../controllers/admincontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: Users & Doctors
router.get("/users", authMiddleware, getAllUsersController);
router.get("/doctors", authMiddleware, getAllDoctorsController);

// Admin: Add doctor
router.post("/add-doctor", authMiddleware, adminAddDoctorController);

// Admin: Approve/reject doctor
router.put("/change-account-status", authMiddleware, changeAccountStatusController);

export default router;
