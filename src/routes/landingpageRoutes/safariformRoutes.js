import express from "express";
import sendSafariInquiry from "../../controller/landingPage/sendSafariInquiry.js";

const router = express.Router();

router.post("/", sendSafariInquiry);

export default router;
