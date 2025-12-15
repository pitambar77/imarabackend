import express from "express";
import upload from "../../middleware/uploads.js";

import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../../controller/teamController/teamController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 50 },
    { name: "profileImages", maxCount: 50 },
  ]),
  createTeam
);

router.get("/", getAllTeams);
router.get("/:id", getTeamById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "adventureImages", maxCount: 50 },
    { name: "profileImages", maxCount: 50 },
  ]),
  updateTeam
);

router.delete("/:id", deleteTeam);

export default router;
