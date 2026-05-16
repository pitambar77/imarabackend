import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createBloglanding,
  getAllBloglanding,
  getBloglandingById,
  updateBloglanding,
  deleteBloglanding,
} from "../../controller/blogController/bloglandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createBloglanding,
);

router.get("/", getAllBloglanding);
router.get("/:id", getBloglandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateBloglanding,
);

router.delete("/:id", deleteBloglanding);

export default router;
