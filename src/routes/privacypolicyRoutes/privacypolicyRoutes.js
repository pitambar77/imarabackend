import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createPrivacypolicy,
  getAllPrivacypolicy,
  getPrivacypolicyById,
  updatePrivacypolicy,
  deletePrivacypolicy,
} from "../../controller/privacypolicyController/privacypolicyController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createPrivacypolicy,
);

router.get("/", getAllPrivacypolicy);
router.get("/:id", getPrivacypolicyById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updatePrivacypolicy,
);

router.delete("/:id", deletePrivacypolicy);

export default router;
