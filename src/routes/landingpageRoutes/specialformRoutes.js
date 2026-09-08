import express from "express";
import sendSpecialOffers from "../../controller/landingPage/sendSpecialOffers.js";

const router = express.Router();

router.post("/", sendSpecialOffers);

export default router;