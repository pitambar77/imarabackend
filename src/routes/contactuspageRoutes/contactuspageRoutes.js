import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createContactuspage,
  getAllContactuspage,
  getContactuspageById,
  updateContactuspage,
  deleteContactuspage,
} from "../../controller/contactuspageController/contactuspageController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createContactuspage,
);

router.get("/", getAllContactuspage);
router.get("/:id", getContactuspageById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateContactuspage,
);

router.delete("/:id", deleteContactuspage);

export default router;
