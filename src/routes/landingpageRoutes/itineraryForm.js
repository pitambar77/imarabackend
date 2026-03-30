import express from "express";
import sendItineraryForm from '../../controller/landingPage/sendItineraryForm.js'

const router = express.Router();

router.post("/", sendItineraryForm);

export default router;