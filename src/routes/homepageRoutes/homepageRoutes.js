import express from "express";
import multer from "multer";

import {
  getHomepage,
  saveHomepage,
} from "../../controller/homePageController/homepageController.js";

const router = express.Router();

/* ================= MULTER ================= */

const upload = multer();

/* ================= ROUTES ================= */

router.get("/", getHomepage);

router.post(
  "/",
  upload.none(), // IMPORTANT
  saveHomepage,
);

export default router;
