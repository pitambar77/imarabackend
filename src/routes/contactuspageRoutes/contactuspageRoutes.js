import express from "express";
import { getContactuspage, saveContactuspage } from "../../controller/contactuspageController/contactuspageController.js";

const router = express.Router();

router.get("/", getContactuspage);
router.post("/", saveContactuspage);

export default router;