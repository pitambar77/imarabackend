import express from "express";
import sendTanzaniaTailormadeSafari from "../../controller/landingPage/tanzaniaTailormadeSafari.js";

const router = express.Router();

router.post("/", sendTanzaniaTailormadeSafari);

export default router;
