// import express from "express";
// import upload from "../../middleware/uploads.js";
// import {
//   createPackage,
//   getAllPackages,
//   getPackageById,
//   updatePackage,
//   deletePackage,
// } from "../../controller/packageController/packageController.js";

// const router = express.Router();

// router.post("/", upload.fields([ 
//   { name: "mainImage", maxCount: 1 },
//   { name: "itineraryImages", maxCount: 200 },
//   { name: "experienceImages", maxCount: 200 },
//   { name: "includeImages", maxCount: 50 },
//   { name: "excludeImages", maxCount: 50 },



//   ]), createPackage);

// router.get("/", getAllPackages);
// router.get("/:id", getPackageById);
// router.put("/:id", upload.single("image"), updatePackage);
// router.delete("/:id", deletePackage);

// export default router;


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

/* ================= CREATE PACKAGE ================= */
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "itineraryImages", maxCount: 200 },

    { name: "experienceImages", maxCount: 200 },
    { name: "includeImages", maxCount: 50 },
    { name: "excludeImages", maxCount: 50 },
  ]),
  createPackage
);

/* ================= GET ALL ================= */
router.get("/", getAllPackages);

/* ================= GET BY ID ================= */
router.get("/:id", getPackageById);

/* ================= UPDATE PACKAGE ================= */
router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "itineraryImages", maxCount: 200 },

    { name: "experienceImages", maxCount: 200 },
    { name: "includeImages", maxCount: 50 },
    { name: "excludeImages", maxCount: 50 },
  ]),
  updatePackage
);

/* ================= DELETE PACKAGE ================= */
router.delete("/:id", deletePackage);

export default router;
