import Corevalue from "../../models/Corevalue/Corevalue.js";
import cloudinary from "../../config/cloudinary.js";

/* ================= SAFE PARSE ================= */

const safeParse = (value) => {
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }

    return [];
  }
};

/* ================= CLEAN HTML ================= */

const cleanHTML = (html = "") => {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<xml[^>]*>[\s\S]*?<\/xml>/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sid="[^"]*"/gi, "")
    .replace(/\sdir="[^"]*"/gi, "")
    .replace(/\srole="[^"]*"/gi, "")
    .replace(/\saria-[^=]*="[^"]*"/gi, "")
    .trim();
};

/* ================= FORMAT FAQ ================= */

const formatFaq = (faqData) => {
  return safeParse(faqData).map((section) => ({
    title: section.title || "",

    subtitle: section.subtitle || "",

    faqs: (section.faqs || []).map((item) => ({
      question: item.question || "",

      answer: cleanHTML(item.answer || ""),
    })),
  }));
};

/* ================= CREATE ================= */

export const createCorevalue = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData || "{}");

    const mainImage = req.files?.mainImage?.[0];

    /* ================= OVERVIEW ================= */

    const overviewinfo = safeParse(req.body.overviewinfo).map((item) => ({
      title: item.title || "",

      subtitle: item.subtitle || "",

      description: cleanHTML(item.description || ""),
    }));

    /* ================= FAQ ================= */

    const faq = formatFaq(req.body.faq);

    const newDoc = await Corevalue.create({
      ...formDataParsed,

      image: mainImage?.path || null,

      imagePublicId: mainImage?.filename || null,

      overviewinfo,

      faq,
    });

    res.status(201).json({
      message: "Corevalue created successfully",
      data: newDoc,
    });
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= GET ALL ================= */

export const getAllCorevalue = async (req, res) => {
  try {
    const data = await Corevalue.find().sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching list",
      error: err.message,
    });
  }
};

/* ================= GET SINGLE ================= */

export const getCorevalueById = async (req, res) => {
  try {
    const page = await Corevalue.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        message: "Contact us page not found",
      });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching page",
      error: err.message,
    });
  }
};

/* ================= UPDATE ================= */

export const updateCorevalue = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = JSON.parse(req.body.formData || "{}");

    /* ================= OVERVIEW ================= */

    updateData.overviewinfo = safeParse(req.body.overviewinfo).map((item) => ({
      title: item.title || "",

      subtitle: item.subtitle || "",

      description: cleanHTML(item.description || ""),
    }));

    /* ================= FAQ ================= */

    updateData.faq = formatFaq(req.body.faq);

    /* ================= MAIN IMAGE ================= */

    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;

      updateData.imagePublicId = req.files.mainImage[0].filename;
    }

    const updated = await Corevalue.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */

export const deleteCorevalue = async (req, res) => {
  try {
    const doc = await Corevalue.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: "Contact us page not found",
      });
    }

    if (doc.imagePublicId) {
      await cloudinary.uploader.destroy(doc.imagePublicId);
    }

    await Corevalue.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting page",
      error: err.message,
    });
  }
};
