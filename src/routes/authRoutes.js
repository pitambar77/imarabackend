import express from "express";
// import { sendLoginOTP, verifyOTP } from "../controller/authController.js";
import { loginAdmin } from "../controller/authController.js";

const router = express.Router();

// router.post("/send-otp", sendLoginOTP);
// router.post("/verify-otp", verifyOTP);
router.post("/login", loginAdmin);

export default router;