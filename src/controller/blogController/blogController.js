

import Imarablog from "../../models/ImaraBlog/Imarablog.js";
import slugify from "slugify";

/* =========================================
   🔹 HELPER: SAFE JSON PARSE
========================================= */
const safeParse = (data) => {
  if (!data) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

/* =========================================
   🔹 CREATE BLOG
========================================= */
export const createBlog = async (req, res) => {
  try {
    let body = req.body;

    // ✅ Parse JSON
    body.sections = safeParse(body.sections) || [];
    body.landingDetails = safeParse(body.landingDetails) || [];

    // ✅ Keywords → tags
    if (body.keywords) {
      body.tags = body.keywords.split(",").map((k) => k.trim());
    }

    // ✅ Auto slug
    if (!body.slug && body.title) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // ✅ Prevent duplicate slug
    const existing = await Imarablog.findOne({ slug: body.slug });
    if (existing) {
      body.slug = `${body.slug}-${Date.now()}`;
    }

    // ✅ Thumbnail
    if (req.files?.thumbnail?.[0]) {
      body.thumbnail = req.files.thumbnail[0].path;
    }

    const blog = await Imarablog.create(body);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   🔹 GET ALL BLOGS (LIGHT)
========================================= */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Imarablog.find().sort({ createdAt: -1 }).select("-sections"); // keep lightweight

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   🔹 GET BLOG BY SLUG
========================================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Imarablog.findOne({ slug: req.params.slug }).populate(
      "relatedBlogs",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   🔹 UPDATE BLOG
========================================= */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;

    // ✅ Parse JSON
    body.sections = safeParse(body.sections);
    body.landingDetails = safeParse(body.landingDetails);

    // ✅ Keywords → tags
    if (body.keywords) {
      body.tags = body.keywords.split(",").map((k) => k.trim());
    }

    // ✅ Slug regenerate (optional)
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // ✅ Thumbnail update
    if (req.files?.thumbnail?.[0]) {
      body.thumbnail = req.files.thumbnail[0].path;
    }

    const blog = await Imarablog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      message: "Blog updated",
      data: blog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   🔹 DELETE BLOG
========================================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Imarablog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   🔹 ADD SECTION
========================================= */
export const addSection = async (req, res) => {
  try {
    const { blogId } = req.params;
    let section = safeParse(req.body);

    const blog = await Imarablog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.sections.push(section);
    await blog.save();

    res.json({ success: true, data: blog.sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   🔹 UPDATE SECTION
========================================= */
export const updateSection = async (req, res) => {
  try {
    const { blogId, sectionId } = req.params;
    let updates = safeParse(req.body);

    const blog = await Imarablog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const section = blog.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    Object.assign(section, updates);

    await blog.save();

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   🔹 DELETE SECTION
========================================= */
export const deleteSection = async (req, res) => {
  try {
    const { blogId, sectionId } = req.params;

    const blog = await Imarablog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.sections = blog.sections.filter((s) => s._id.toString() !== sectionId);

    await blog.save();

    res.json({ success: true, message: "Section deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   🔹 ADD IMAGE TO SECTION
========================================= */
export const addImageToSection = async (req, res) => {
  try {
    const { blogId, sectionId } = req.params;

    const blog = await Imarablog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const section = blog.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    const newImages = req.files.map((file) => ({
      url: file.path,
      alt: file.originalname,
    }));

    if (section.images) {
      section.images.push(...newImages);
    } else {
      section.image = newImages[0];
    }

    await blog.save();

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   🔹 DELETE IMAGE FROM SECTION
========================================= */
export const deleteImageFromSection = async (req, res) => {
  try {
    const { blogId, sectionId, imageIndex } = req.params;

    const blog = await Imarablog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const section = blog.sections.id(sectionId);

    if (!section || !section.images)
      return res.status(404).json({ message: "Image not found" });

    section.images.splice(imageIndex, 1);

    await blog.save();

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
