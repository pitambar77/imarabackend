import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createEnquiryformpage,
  getAllEnquiryformpage,
  getEnquiryformpageById,
  updateEnquiryformpage,
  deleteEnquiryformpage,
} from "../../controller/enquiryformpageController/enquiryformpageController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createEnquiryformpage,
);

router.get("/", getAllEnquiryformpage);
router.get("/:id", getEnquiryformpageById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateEnquiryformpage,
);

router.delete("/:id", deleteEnquiryformpage);

export default router;
