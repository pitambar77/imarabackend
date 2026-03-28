import express from "express";
import sendEnquiryForm from "../../controller/landingPage/sendEnquiryForm.js";

const router = express.Router();

router.post("/", sendEnquiryForm);

export default router;