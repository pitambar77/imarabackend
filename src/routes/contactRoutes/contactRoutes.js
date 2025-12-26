import express from "express";
import { submitContactForm } from "../../controller/contactController/contactController.js";

const router = express.Router();

router.post("/", submitContactForm);

export default router;
