// import express from "express";
// import upload from "../../middleware/uploads.js";

// import {
//   createBlog,
//   getBlogs,
//   getBlogBySlug,
//   getBlogById,
//   updateBlog,
//   deleteBlog,
//   addSection,
//   updateSection,
//   deleteSection,
//   addImageToSection,
//   deleteImageFromSection,
//   filterByCategory,
// } from "../../controller/travelguideController/travelguidenewController.js";

// const router = express.Router();

// // CREATE BLOG
// router.post(
//   "",
//   upload.fields([
//     { name: "thumbnail", maxCount: 1 },
//     { name: "sectionImages", maxCount: 100 },
//   ]),
//   createBlog,
// );

// // GET ALL BLOGS
// router.get("/", getBlogs);

// // GET BLOG BY SLUG
// router.get("/slug/:slug", getBlogBySlug);

// // FILTER CATEGORY
// router.get("/category/:category", filterByCategory);

// router.get("/:id", getBlogById);

// // UPDATE BLOG
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "thumbnail", maxCount: 1 },
//     { name: "sectionImages", maxCount: 100 },
//   ]),
//   updateBlog,
// );

// // DELETE BLOG
// router.delete("/:id", deleteBlog);

// // ADD SECTION
// router.post("/:blogId/section", addSection);

// // UPDATE SECTION
// router.put("/:blogId/section/:sectionId", updateSection);

// // DELETE SECTION
// router.delete("/:blogId/section/:sectionId", deleteSection);

// /* =========================================
//    SECTION IMAGE ROUTES
// ========================================= */

// // ADD IMAGE TO SECTION
// router.post(
//   "/:blogId/section/:sectionId/images",
//   upload.array("images", 20),
//   addImageToSection,
// );

// // DELETE IMAGE FROM SECTION
// router.delete(
//   "/:blogId/section/:sectionId/images/:imageIndex",
//   deleteImageFromSection,
// );

// export default router;

import express from "express";
import upload from "../../middleware/uploads.js";

import {
  uploadImage,
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getBlogBySlug,
  filterByCategory,
} from "../../controller/travelguideController/travelguidenewController.js";

const router = express.Router();

// Standalone image upload (for sections)
router.post("/uploads", upload.single("file"), uploadImage);

// Blog CRUD
router.post("/", upload.single("thumbnail"), createBlog);
router.get("/", getBlogs);

// ✅ KEEP THIS
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("thumbnail"), updateBlog);
router.delete("/:id", deleteBlog);

// Additional
router.get("/:id/related", getRelatedBlogs);
router.get("/category/:category", filterByCategory);

export default router;
