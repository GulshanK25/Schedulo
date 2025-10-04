import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} from "../controllers/admincontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsersController);
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

export default router;
