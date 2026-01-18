import express from "express";
import upload from "../../middleware/uploads.js";
import {
  createDestinationdetails,
  getAllDestinationdetails,
  getDestinationdetailsById,
  updateDestinationdetails,
  deleteDestinationdetails,
} from "../../controller/destinationController/destinationdetailsController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
    { name: "migrationImages", maxCount: 10 },
    { name: "adventureImages", maxCount: 10 },
  ]),
  createDestinationdetails
);

router.get("/", getAllDestinationdetails);
router.get("/:id", getDestinationdetailsById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
     { name: "landingImage", maxCount: 1 }, // ✅ ADD THIS
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
    { name: "migrationImages", maxCount: 10 },
    { name: "adventureImages", maxCount: 10 },
  ]),
  updateDestinationdetails
);

router.delete("/:id", deleteDestinationdetails);

export default router;
