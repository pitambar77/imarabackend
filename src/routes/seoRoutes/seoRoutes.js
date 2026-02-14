import express from "express";
import {
  createSEO,
  getSEO,
  updateSEO,
  deleteSEO,
} from "../../controller/seoController/seoController.js";

const router = express.Router();

router.post("/", createSEO);              // Create
router.get("/", getSEO);                  // Get by reference
router.put("/:id", updateSEO);            // Update
router.delete("/:id", deleteSEO);         // Delete

export default router;
