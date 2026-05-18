import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createCorevalue,
  getAllCorevalue,
  getCorevalueById,
  updateCorevalue,
  deleteCorevalue,
} from "../../controller/corevalueController/corevalueController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createCorevalue,
);

router.get("/", getAllCorevalue);
router.get("/:id", getCorevalueById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateCorevalue,
);

router.delete("/:id", deleteCorevalue);

export default router;
