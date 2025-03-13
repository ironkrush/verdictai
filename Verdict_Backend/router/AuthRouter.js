const express = require("express")
const router = express.Router();
const AuthController = require("../controller/AuthController");
// const validation = require("../middleware/zodMiddleware");
// const signupValidation=require("../util/UserValidation")

// router.post("/", validation.UserValidation(signupValidation), SignupController.UserSignup)
router.post("/signup", AuthController.UserSignup);
router.post("/login", AuthController.loginUser);
router.post("/forgotpassword", AuthController.SendOTPOnForgotPassword);
router.post("/verify", AuthController.verifyOTP);
router.post("/updatepassword",AuthController.updatePassword);


module.exports = router