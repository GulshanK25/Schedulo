// File: Backend/routes/adminroutes.cjs
const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/admincontroller_test.cjs");

console.log("DEBUG controllers loaded:", {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
});

const router = express.Router();

router.get("/getAllUsers", getAllUsersController);
router.get("/getAllDoctors", getAllDoctorsController);
router.post("/changeAccountStatus", changeAccountStatusController);

module.exports = router;
