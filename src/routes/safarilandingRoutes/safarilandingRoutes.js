import express from "express";
import { getSafarilanding, saveSafarilanding } from "../../controller/safariLandingController/safarilandingController.js";

const router = express.Router();

router.get("/", getSafarilanding);
router.post("/", saveSafarilanding);

export default router;