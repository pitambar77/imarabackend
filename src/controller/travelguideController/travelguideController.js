import Blog from "../../models/Travelguide/Blog.js";
import slugify from "slugify";

/**
 * Upload standalone images (Cloudinary)
 */
export const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  return res.json({ url: req.file.path });  
};

/**
 * Create Blog
 */
export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, slug, sections, category, keywords } = req.body;

    // Generate base slug
    let baseSlug = slug || slugify(title, { lower: true, strict: true });

    // Check for duplicates
    let existing = await Blog.findOne({ slug: baseSlug });

    // If duplicate, append unique id
    if (existing) {
      baseSlug = `${baseSlug}-${Date.now()}`;
    }

    const blog = new Blog({
      title,
      subtitle,
      slug:baseSlug,
      category,
      keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
      sections: sections ? JSON.parse(sections) : [],
      thumbnail: req.file ? req.file.path : null,
    });

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error("Create Blog Error:", err.message);
    return res.status(400).json({ error: "Failed to create blog", details: err.message });
  }
};

/**
 * Get all blogs
 */
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return res.json(blogs);
};

/**
 * Get single blog by ID
 */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    return res.json(blog);
  } catch {
    return res.status(400).json({ error: "Invalid blog ID" });
  }
};

/**
 * Update Blog
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, subtitle, slug, sections, category, keywords } = req.body;

    const updateData = {
      title,
      slug,
      category,
      keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
      sections: sections ? JSON.parse(sections) : [],
    };

    if (req.file) updateData.thumbnail = req.file.path;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.json(blog);
  } catch (err) {
    console.error("Update Error:", err.message);
    return res.status(400).json({ error: "Update failed", details: err.message });
  }
};

/**
 * Delete Blog
 */
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch {
    return res.status(400).json({ error: "Delete failed" });
  }
};

/**
 * Get Related Blogs
 */
export const getRelatedBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: id }
    }).sort({ createdAt: -1 }).limit(3);

    return res.json(relatedBlogs);
  } catch (err) {
    console.error("Related Blog Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch related blogs" });
  }
};

/**
 * Filter by Category
 */
export const filterByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category }).sort({ createdAt: -1 });

    return res.json(blogs);
  } catch (err) {
    return res.status(500).json({ error: "Failed to filter blogs" });
  }
};
