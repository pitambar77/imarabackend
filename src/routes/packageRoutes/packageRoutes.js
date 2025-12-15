import express from "express";
import upload from "../../middleware/uploads.js";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../../controller/packageController/packageController.js";

const router = express.Router();

router.post("/", upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "itineraryImages", maxCount: 10 },
    { name: "experienceImages", maxCount: 10 }
  ]), createPackage);

router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.put("/:id", upload.single("image"), updatePackage);
router.delete("/:id", deletePackage);

export default router;
