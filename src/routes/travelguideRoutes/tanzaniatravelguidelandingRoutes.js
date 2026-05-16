import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createTanzaniadestinationlanding,
  getAllTanzaniadestinationlanding,
  getTanzaniadestinationlandingById,
  updateTanzaniadestinationlanding,
  deleteTanzaniadestinationlanding,
} from "../../controller/travelguideController/tanzaniatravelguidelandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createTanzaniadestinationlanding,
);

router.get("/", getAllTanzaniadestinationlanding);
router.get("/:id", getTanzaniadestinationlandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateTanzaniadestinationlanding,
);

router.delete("/:id", deleteTanzaniadestinationlanding);

export default router;
