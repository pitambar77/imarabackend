import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createSustanbility,
  getAllSustanbility,
  getSustanbilityById,
  updateSustanbility,
  deleteSustanbility,
} from "../../controller/sustanbilityController/sustanbilityController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 20 },
    { name: "effectiveImages", maxCount: 20 },
    { name: "whyvisitImages", maxCount: 20 },
  ]),
  createSustanbility
);

router.get("/", getAllSustanbility);
router.get("/:id", getSustanbilityById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 20 },
    { name: "effectiveImages", maxCount: 20 },
    { name: "whyvisitImages", maxCount: 20 },
  ]),
  updateSustanbility
);

router.delete("/:id", deleteSustanbility);

export default router;
