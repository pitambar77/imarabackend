import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createKilimanjarolanding,
  getAllKilimanjarolanding,
  getKilimanjarolandingById,
  updateKilimanjarolanding,
  deleteKilimanjarolanding,
} from "../../controller/kilimanjarolandingController/kilimanjarolandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 50 },
    { name: "adventureImages", maxCount: 200 },
  ]),
  createKilimanjarolanding
);

router.get("/", getAllKilimanjarolanding);
router.get("/:id", getKilimanjarolandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 50 },
    { name: "adventureImages", maxCount: 200 },
  ]),
  updateKilimanjarolanding
);

router.delete("/:id", deleteKilimanjarolanding);

export default router;
