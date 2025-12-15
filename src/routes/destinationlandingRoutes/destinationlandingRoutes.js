import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createDestinationlanding,
  getAllDestinationlanding,
  getDestinationlandingById,
  updateDestinationlanding,
  deleteDestinationlanding,
} from "../../controller/destinationController/destinationlandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
  ]),
  createDestinationlanding
);

router.get("/", getAllDestinationlanding);
router.get("/:id", getDestinationlandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
  ]),
  updateDestinationlanding
);

router.delete("/:id", deleteDestinationlanding);

export default router;
