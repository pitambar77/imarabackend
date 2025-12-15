import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createFleet,
  getAllFleet,
  getFleetById,
  updateFleet,
  deleteFleet,
} from "../../controller/fleetController/fleetController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
  ]),
  createFleet
);

router.get("/", getAllFleet);
router.get("/:id", getFleetById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
  ]),
  updateFleet
);

router.delete("/:id", deleteFleet);

export default router;
