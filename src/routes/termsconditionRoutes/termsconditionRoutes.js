import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createTermscondition,
  getAllTermscondition,
  getTermsconditionById,
  updateTermscondition,
  deleteTermscondition,
} from "../../controller/termsconditionController/termsconditionController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createTermscondition,
);

router.get("/", getAllTermscondition);
router.get("/:id", getTermsconditionById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateTermscondition,
);

router.delete("/:id", deleteTermscondition);

export default router;
