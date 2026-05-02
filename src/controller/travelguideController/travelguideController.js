import Seo from "../../models/Seo/Seo.js";
import Blog from "../../models/Travelguide/Blog.js";
import slugify from "slugify";

/**
 * Upload standalone images (Cloudinary)
 */

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const transformFaq = (faqSections) => {
  return faqSections?.map((section) => ({
    ...(section.toObject?.() || section),

    faqs: (section.faqs || []).map((faq) => ({
      ...(faq.toObject?.() || faq),

      // ✅ ALWAYS send raw answer (for edit)
      answer: (faq.answer || []).map((block) => ({
        type: block.type,
        content: block.content,
      })),

      // ✅ UI format
      answerBlocks: (faq.answer || []).map((block) => {
        if (block.type === "list") {
          return {
            type: "list",
            items: Array.isArray(block.content)
              ? block.content
              : [block.content],
          };
        }

        return {
          type: block.type === "header" ? "heading" : block.type,
          text: block.content,
        };
      }),
    })),
  }));
};

const formatFaq = (faqData) => {
  return safeParse(faqData).map((section) => ({
    title: section.title,
    subtitle: section.subtitle || "",
    faqs: (section.faqs || []).map((item) => ({
      question: item.question,
      answer: (item.answer || []).map((block) => ({
        type: block.type,
        content: block.content,
      })),
    })),
  }));
};

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
      slug: baseSlug,
      category,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
      sections: sections ? JSON.parse(sections) : [],
      thumbnail: req.file ? req.file.path : null,
      faq: formatFaq(req.body.faq),
    });

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error("Create Blog Error:", err.message);
    return res
      .status(400)
      .json({ error: "Failed to create blog", details: err.message });
  }
};

/**
 * Get all blogs
 */
// export const getBlogs = async (req, res) => {
//   const blogs = await Blog.find().sort({ createdAt: -1 });
//   return res.json(blogs);
// };

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });

  const transformed = blogs.map((blog) => ({
    ...blog.toObject(),
    faq: transformFaq(blog.faq),
  }));

  return res.json(transformed);
};

/**
 * Get single blog by ID
 * =========================
 */
// export const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ error: "Blog not found" });

//     const seoData = await Seo.findOne({
//       referenceId: blog._id,
//       referenceType: "blog",
//     });

//     res.json({
//       ...blog.toObject(), // 👈 spread main document
//       seo: seoData || null, // 👈 attach seo inside
//     });

//     // return res.json(blog);
//   } catch {
//     return res.status(400).json({ error: "Invalid blog ID" });
//   }
// };

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const seoData = await Seo.findOne({
      referenceId: blog._id,
      referenceType: "blog",
    });

    const transformed = {
      ...blog.toObject(),
      faq: transformFaq(blog.faq),
      seo: seoData || null,
    };

    res.json(transformed);
  } catch {
    return res.status(400).json({ error: "Invalid blog ID" });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const seoData = await Seo.findOne({
      referenceId: blog._id,
      referenceType: "blog",
    });

    const transformed = {
      ...blog.toObject(),
      faq: transformFaq(blog.faq), // 🔥 IMPORTANT
      seo: seoData || null,
    };

    res.json(transformed);
  } catch (err) {
    console.error("Slug fetch error:", err);
    res.status(500).json({ error: "Failed to fetch blog" });
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
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
      sections: sections ? JSON.parse(sections) : [],
      faq: formatFaq(req.body.faq),
    };

    if (req.file) updateData.thumbnail = req.file.path;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    return res.json(blog);
  } catch (err) {
    console.error("Update Error:", err.message);
    return res
      .status(400)
      .json({ error: "Update failed", details: err.message });
  }
};

/**
 * Delete Blog
 */
export const deleteBlog = async (req, res) => {
  try {
    await Seo.deleteOne({
      referenceId: req.params.id,
      referenceType: "blog",
    });
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
      _id: { $ne: id },
    })
      .sort({ createdAt: -1 })
      .limit(3);

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
