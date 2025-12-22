import express from "express";
import upload from "../../middleware/uploads.js";
import { createZanzibardetails, deleteZanzibardetails, getAllZanzibardetails, getZanzibardetailsById, updateZanzibardetails } from "../../controller/zanzibarController/zanzibarController.js";


const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
    { name: "migrationImages", maxCount: 10 },
    { name: "adventureImages", maxCount: 10 },
  ]),
  createZanzibardetails
);

router.get("/", getAllZanzibardetails);
router.get("/:id", getZanzibardetailsById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 10 },
    { name: "highlightImages", maxCount: 10 },
    { name: "migrationImages", maxCount: 10 },
    { name: "adventureImages", maxCount: 10 },
  ]),
  updateZanzibardetails
);

router.delete("/:id", deleteZanzibardetails);

export default router;
