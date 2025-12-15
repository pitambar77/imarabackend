import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout
} from "../../controller/aboutController/aboutController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 200 },
  ]),
  createAbout
);

router.get("/", getAllAbout);
router.get("/:id", getAboutById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 200 },
  ]),
  updateAbout
);

router.delete("/:id", deleteAbout);

export default router;
