const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { verifyAuthToken } = require("../middleware/verifyToken");

router.post("/login/phone", authController.loginUsingMobile);
router.post("/login/email", authController.loginUsingEmail);
router.post("/get-otp", authController.loginUsingWecareEmail);
router.post("/create-wecare-user", authController.createWecareUser);
router.post("/verify-OTP", authController.verifyOTP);
router.post("/verify-email-OTP", authController.verifyEmailOTP);

module.exports = router;