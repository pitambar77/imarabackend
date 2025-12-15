import express from "express";
import upload from "../../middleware/uploads.js";
import Travelgroup from "../../models/Traelgroup/Travelgroup.js";

import {
  createTravelgroup,
  getAllTravelgroups,
  getTravelgroupById,
  updateTravelgroup,
  deleteTravelgroup,
} from "../../controller/travelgroupController/travelgroupController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 20 },
    { name: "adventureImages", maxCount: 20 },
  ]),
  createTravelgroup
);

router.get("/", getAllTravelgroups);


router.get("/slug/:slug", async (req, res) => {
  try {
    const item = await Travelgroup.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/slug/:slug", async (req, res) => {
//   try {
//     console.log("Slug Coming:", req.params.slug);
//     const item = await Travelgroup.findOne({ slug: req.params.slug });

//     if (!item) {
//       console.log("No item found");
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.json(item);
//   } catch (err) {
//     console.log("ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


router.get("/:id", getTravelgroupById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "overviewImages", maxCount: 20 },
    { name: "adventureImages", maxCount: 20 },
  ]),
  updateTravelgroup
);

router.delete("/:id", deleteTravelgroup);

export default router;
