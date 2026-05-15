// import Travelguide from "../../models/Travelguide/Travelguide.js";
// import slugify from "slugify";

// /* =========================================
//    🔹 HELPER: SAFE JSON PARSE
// ========================================= */
// const safeParse = (data) => {
//   if (!data) return data;
//   if (typeof data === "string") {
//     try {
//       return JSON.parse(data);
//     } catch {
//       return data;
//     }
//   }
//   return data;
// };

// /* =========================================
//    🔹 CREATE BLOG
// ========================================= */
// export const createBlog = async (req, res) => {
//   try {
//     let body = req.body;

//     // ✅ Parse JSON
//     body.sections = safeParse(body.sections) || [];

//     // ✅ Auto slug
//     if (!body.slug && body.title) {
//       body.slug = slugify(body.title, { lower: true, strict: true });
//     }

//     // ✅ Prevent duplicate slug
//     const existing = await Travelguide.findOne({ slug: body.slug });
//     if (existing) {
//       body.slug = `${body.slug}-${Date.now()}`;
//     }

//     // ✅ Thumbnail
//     if (req.files?.thumbnail?.[0]) {
//       body.thumbnail = req.files.thumbnail[0].path;
//     }

//     // ✅ SECTION IMAGES
//     if (req.files?.sectionImages?.length) {
//       let imageIndex = 0;

//       body.sections.forEach((section) => {
//         // SINGLE IMAGE
//         if (section.type === "image") {
//           const file = req.files.sectionImages[imageIndex];

//           if (file) {
//             section.image = {
//               url: file.path,
//               alt: file.originalname,
//             };

//             imageIndex++;
//           }
//         }

//         // IMAGE GRID
//         if (section.type === "imageGrid" && Array.isArray(section.images)) {
//           section.images = section.images.map(() => {
//             const file = req.files.sectionImages[imageIndex];

//             imageIndex++;

//             return {
//               url: file.path,
//               alt: file.originalname,
//             };
//           });
//         }

//         // IMAGE CONTENT
//         if (
//           section.type === "imageContent" &&
//           Array.isArray(section.sections)
//         ) {
//           section.sections = section.sections.map((item) => {
//             const file = req.files.sectionImages[imageIndex];

//             imageIndex++;

//             return {
//               ...item,
//               image: {
//                 url: file.path,
//                 alt: file.originalname,
//               },
//             };
//           });
//         }
//       });
//     }

//     const blog = await Travelguide.create(body);

//     res.status(201).json({
//       success: true,
//       message: "Travel guide created successfully",
//       data: blog,
//     });
//   } catch (error) {
//     console.error("Create Travelguide Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================================
//    🔹 GET ALL BLOGS (LIGHT)
// ========================================= */
// export const getBlogs = async (req, res) => {
//   try {
//     const blogs = await Travelguide.find()
//       .sort({ createdAt: -1 })
//       .select("-sections"); // keep lightweight

//     res.json({
//       success: true,
//       count: blogs.length,
//       data: blogs,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================================
//    🔹 GET BLOG BY SLUG
// ========================================= */
// export const getBlogBySlug = async (req, res) => {
//   try {
//     const blog = await Travelguide.findOne({ slug: req.params.slug });

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     res.json({ success: true, data: blog });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getBlogById = async (req, res) => {
//   try {
//     const blog = await Travelguide.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Travel guide not found",
//       });
//     }

//     res.json(blog);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* =========================================
//    🔹 UPDATE BLOG
// ========================================= */
// export const updateBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let body = req.body;

//     // ✅ Parse JSON
//     body.sections = safeParse(body.sections) || [];

//     // ✅ Slug regenerate (optional)
//     if (body.title && !body.slug) {
//       body.slug = slugify(body.title, { lower: true, strict: true });
//     }

//     // ✅ Thumbnail update
//     if (req.files?.thumbnail?.[0]) {
//       body.thumbnail = req.files.thumbnail[0].path;
//     }

//     // ✅ SECTION IMAGES
//     if (req.files?.sectionImages?.length) {
//       let imageIndex = 0;

//       body.sections.forEach((section) => {
//         // SINGLE IMAGE
//         if (section.type === "image") {
//           const file = req.files.sectionImages[imageIndex];

//           if (file) {
//             section.image = {
//               url: file.path,
//               alt: file.originalname,
//             };

//             imageIndex++;
//           }
//         }

//         // IMAGE GRID
//         if (section.type === "imageGrid" && Array.isArray(section.images)) {
//           section.images = section.images.map(() => {
//             const file = req.files.sectionImages[imageIndex];

//             imageIndex++;

//             return {
//               url: file.path,
//               alt: file.originalname,
//             };
//           });
//         }

//         // IMAGE CONTENT
//         if (
//           section.type === "imageContent" &&
//           Array.isArray(section.sections)
//         ) {
//           section.sections = section.sections.map((item) => {
//             const file = req.files.sectionImages[imageIndex];

//             imageIndex++;

//             return {
//               ...item,
//               image: {
//                 url: file.path,
//                 alt: file.originalname,
//               },
//             };
//           });
//         }
//       });
//     }

//     const blog = await Travelguide.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Travel guide not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Blog updated",
//       data: blog,
//     });
//   } catch (error) {
//     console.error("Update Blog Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================================
//    🔹 DELETE BLOG
// ========================================= */
// export const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Travelguide.findByIdAndDelete(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     res.json({ success: true, message: "Blog deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================================
//    🔹 ADD SECTION
// ========================================= */
// export const addSection = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     let section = safeParse(req.body);

//     const blog = await Travelguide.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     blog.sections.push(section);
//     await blog.save();

//     res.json({ success: true, data: blog.sections });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* =========================================
//    🔹 UPDATE SECTION
// ========================================= */
// export const updateSection = async (req, res) => {
//   try {
//     const { blogId, sectionId } = req.params;
//     let updates = safeParse(req.body);

//     const blog = await Travelguide.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     const section = blog.sections.id(sectionId);
//     if (!section) return res.status(404).json({ message: "Section not found" });

//     Object.assign(section, updates);

//     await blog.save();

//     res.json({ success: true, data: section });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* =========================================
//    🔹 DELETE SECTION
// ========================================= */
// export const deleteSection = async (req, res) => {
//   try {
//     const { blogId, sectionId } = req.params;

//     const blog = await Travelguide.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     blog.sections = blog.sections.filter((s) => s._id.toString() !== sectionId);

//     await blog.save();

//     res.json({ success: true, message: "Section deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* =========================================
//    🔹 ADD IMAGE TO SECTION
// ========================================= */
// export const addImageToSection = async (req, res) => {
//   try {
//     const { blogId, sectionId } = req.params;

//     const blog = await Travelguide.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     const section = blog.sections.id(sectionId);
//     if (!section) return res.status(404).json({ message: "Section not found" });

//     const newImages = req.files.map((file) => ({
//       url: file.path,
//       alt: file.originalname,
//     }));

//     if (section.images) {
//       section.images.push(...newImages);
//     } else {
//       section.image = newImages[0];
//     }

//     await blog.save();

//     res.json({ success: true, data: section });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* =========================================
//    🔹 DELETE IMAGE FROM SECTION
// ========================================= */
// export const deleteImageFromSection = async (req, res) => {
//   try {
//     const { blogId, sectionId, imageIndex } = req.params;

//     const blog = await Travelguide.findById(blogId);
//     if (!blog)
//       return res.status(404).json({ message: "Travelguide not found" });

//     const section = blog.sections.id(sectionId);

//     if (!section || !section.images)
//       return res.status(404).json({ message: "Image not found" });

//     section.images.splice(imageIndex, 1);

//     await blog.save();

//     res.json({ success: true, data: section });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const filterByCategory = async (req, res) => {
//   try {
//     const blogs = await Travelguide.find({
//       category: req.params.category,
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: blogs.length,
//       data: blogs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import Seo from "../../models/Seo/Seo.js";
import Travelguide from "../../models/Travelguide/Travelguide.js";
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
    let existing = await Travelguide.findOne({ slug: baseSlug });

    // If duplicate, append unique id
    if (existing) {
      baseSlug = `${baseSlug}-${Date.now()}`;
    }

    const blog = new Travelguide({
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

export const getBlogs = async (req, res) => {
  const blogs = await Travelguide.find().sort({ createdAt: -1 });

  const transformed = blogs.map((blog) => ({
    ...blog.toObject(),
    faq: transformFaq(blog.faq),
  }));

  return res.json(transformed);
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Travelguide.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Travelguide not found" });

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
    const blog = await Travelguide.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ error: "Travelguide not found" });
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
      subtitle,
      slug,
      category,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
      sections: sections ? JSON.parse(sections) : [],
      faq: formatFaq(req.body.faq),
    };

    if (req.file) updateData.thumbnail = req.file.path;

    const blog = await Travelguide.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      },
    );
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
    await Travelguide.findByIdAndDelete(req.params.id);
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

    const blog = await Travelguide.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const relatedBlogs = await Travelguide.find({
      category: blog.category,
      _id: { $ne: id },
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.json(relatedBlogs);
  } catch (err) {
    console.error("Related Travelguide Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch related blogs" });
  }
};

/**
 * Filter by Category
 */
export const filterByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await Travelguide.find({ category }).sort({ createdAt: -1 });

    return res.json(blogs);
  } catch (err) {
    return res.status(500).json({ error: "Failed to filter blogs" });
  }
};
