
const express = require("express");
const {
  registerController,
  loginController,
  authController,
} = require("../controllers/usercontroller.cjs"); 

const router = express.Router();


router.post("/register", registerController);      
router.post("/login", loginController);            
router.post("/getUserData", authController);       


module.exports = router;
