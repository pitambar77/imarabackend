import express from "express";
import uploads from "../../middleware/uploads.js";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  addSection,
  updateSection,
  deleteSection,
  addImageToSection,
  deleteImageFromSection,
} from "../../controller/blogController/blogController.js";

const router = express.Router();

/* =========================================
   🔹 BLOG CRUD
========================================= */

// ✅ CREATE
router.post(
  "/",
  uploads.fields([{ name: "thumbnail", maxCount: 1 }]),
  createBlog,
);

// ✅ GET ALL
router.get("/", getBlogs);

// ✅ IMPORTANT: GET BY SLUG (keep AFTER /)
router.get("/slug/:slug", getBlogBySlug);

// ✅ GET BY ID (for edit page 🔥)
router.get("/id/:id", async (req, res) => {
  try {
    const blog = await (
      await import("../../models/Blohg/Imarablog.js")
    ).default.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE
router.put(
  "/:id",
  uploads.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateBlog,
);

// ✅ DELETE
router.delete("/:id", deleteBlog);

/* =========================================
   🔹 SECTION APIs
========================================= */

// ADD SECTION
router.post("/:blogId/sections", addSection);

// UPDATE SECTION
router.put("/:blogId/sections/:sectionId", updateSection);

// DELETE SECTION
router.delete("/:blogId/sections/:sectionId", deleteSection);

/* =========================================
   🔹 IMAGE APIs
========================================= */

// ADD IMAGE(S)
router.post(
  "/:blogId/sections/:sectionId/images",
  uploads.array("images"),
  addImageToSection,
);

// DELETE IMAGE
router.delete(
  "/:blogId/sections/:sectionId/images/:imageIndex",
  deleteImageFromSection,
);

export default router;
