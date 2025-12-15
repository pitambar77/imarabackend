import express from "express";
import upload from "../../middleware/uploads.js";
import Blog from "../../models/Travelguide/Blog.js";
import {
  uploadImage,
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  filterByCategory
} from "../../controller/travelguideController/travelguideController.js";

const router = express.Router();

// Standalone image upload (for sections)
router.post("/uploads", upload.single("file"), uploadImage);

// Blog CRUD
router.post("/blog", upload.single("thumbnail"), createBlog);
router.get("/blog", getBlogs);

router.get("/blog/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/blog/:id", getBlogById);
router.put("/blog/:id", upload.single("thumbnail"), updateBlog);
router.delete("/blog/:id", deleteBlog);

// Additional
router.get("/blog/:id/related", getRelatedBlogs);
router.get("/blog/category/:category", filterByCategory);

export default router;
