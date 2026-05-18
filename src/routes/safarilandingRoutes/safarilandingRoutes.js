
import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createSafarilanding,
  getAllSafarilanding,
  getSafarilandingById,
  updateSafarilanding,
  deleteSafarilanding,
} from "../../controller/safariLandingController/safarilandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 50 },
    { name: "adventureImages", maxCount: 200 },
    { name: "routeImages", maxCount: 50 }, // ✅ ADD THIS
    { name: "whenvisitImages", maxCount: 200 }, // ✅ (for month images)
    { name: "travelguideImages", maxCount: 200 },
    { name: "relatedsectionImages", maxCount: 200 },
  ]),
  createSafarilanding,
);

router.get("/", getAllSafarilanding);
router.get("/:id", getSafarilandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 50 },
    { name: "adventureImages", maxCount: 200 },
    { name: "routeImages", maxCount: 50 }, // ✅ ADD THIS
    { name: "whenvisitImages", maxCount: 200 }, // ✅ (for month images)
    { name: "travelguideImages", maxCount: 200 },
    { name: "relatedsectionImages", maxCount: 200 },
  ]),
  updateSafarilanding,
);

router.delete("/:id", deleteSafarilanding);

export default router;
