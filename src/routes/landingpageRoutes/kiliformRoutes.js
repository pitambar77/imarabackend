import express from "express";
import sendContactMail from "../../controller/landingPage/KilimanjaroForm.js";

const router = express.Router();

router.post("/", sendContactMail);

export default router;
