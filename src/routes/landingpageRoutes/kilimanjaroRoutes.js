import express from "express";
import multer from "multer";

import kilimanjaroQuoteController from "../../controller/landingPage/kilimanjaroQuoteController.js";

const router = express.Router();

const upload = multer();

router.post("/", upload.none(), kilimanjaroQuoteController);

export default router;
