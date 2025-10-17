import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  adminAddDoctorController,
  changeAccountStatusController
} from "../controllers/admincontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/users", authMiddleware, getAllUsersController);
router.get("/doctors", authMiddleware, getAllDoctorsController);
router.post("/add-doctor", authMiddleware, adminAddDoctorController);
router.put("/change-account-status", authMiddleware, changeAccountStatusController);

export default router;
