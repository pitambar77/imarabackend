import express from "express";
import { sendLoginOTP, verifyOTP } from "../controller/authController.js";

const router = express.Router();

router.post("/send-otp", sendLoginOTP);
router.post("/verify-otp", verifyOTP);

export default router;