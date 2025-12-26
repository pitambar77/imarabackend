import express from "express";
import { submitContactForm } from "../../controller/contactController/contactformkiliController.js";

const router = express.Router();

router.post("/", submitContactForm);

export default router;
