import Sustanbility from "../../models/Sustanbility/Sustanbility.js";
import cloudinary from "../../config/cloudinary.js";

// Parse JSON safely
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string")
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
  }
};

/**
 * CREATE SUSTANBILITY
 */
export const createSustanbility = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    // Main image
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    // Section image uploads
    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];
    const effectiveImages = req.files?.effectiveImages?.map((f) => f.path) || [];
    const whyvisitImages = req.files?.whyvisitImages?.map((f) => f.path) || [];

    // Parse array data
    const parsedOverview = safeParse(req.body.overviewinfo);
    const parsedAdventure = safeParse(req.body.adventure).map((item, i) => ({
      ...item,
      image: adventureImages[i] || item.image || null,
    }));

    const parsedEffective = safeParse(req.body.effective).map((item, i) => ({
      ...item,
      image: effectiveImages[i] || item.image || null,
    }));

    const parsedWhyvisit = safeParse(req.body.whyvisit).map((item, i) => ({
      ...item,
      image: whyvisitImages[i] || item.image || null,
    }));

    const newRecord = await Sustanbility.create({
      ...formDataParsed,
      image: mainImage,
      overviewinfo: parsedOverview,
      adventure: parsedAdventure,
      effective: parsedEffective,
      whyvisit: parsedWhyvisit,
    });

    res.status(201).json({ message: "Sustanbility created successfully", data: newRecord });

  } catch (err) {
    console.error("❌ Error creating sustanbility:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET ALL
 */
export const getAllSustanbility = async (req, res) => {
  try {
    const data = await Sustanbility.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching records", error: err.message });
  }
};


/**
 * GET BY ID
 */
export const getSustanbilityById = async (req, res) => {
  try {
    const data = await Sustanbility.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching record", error: err.message });
  }
};


/**
 * UPDATE
 */
export const updateSustanbility = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;

    updateData.overviewinfo = safeParse(updateData.overviewinfo);
    updateData.adventure = safeParse(updateData.adventure);
    updateData.effective = safeParse(updateData.effective);
    updateData.whyvisit = safeParse(updateData.whyvisit);

    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];
    const effectiveImages = req.files?.effectiveImages?.map((f) => f.path) || [];
    const whyvisitImages = req.files?.whyvisitImages?.map((f) => f.path) || [];

    if (updateData.adventure) {
      updateData.adventure = updateData.adventure.map((item, i) => ({
        ...item,
        image: adventureImages[i] || item.image || null,
      }));
    }

    if (updateData.effective) {
      updateData.effective = updateData.effective.map((item, i) => ({
        ...item,
        image: effectiveImages[i] || item.image || null,
      }));
    }

    if (updateData.whyvisit) {
      updateData.whyvisit = updateData.whyvisit.map((item, i) => ({
        ...item,
        image: whyvisitImages[i] || item.image || null,
      }));
    }

    // Update main image if uploaded
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updated = await Sustanbility.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Updated successfully", data: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE
 */
export const deleteSustanbility = async (req, res) => {
  try {
    const record = await Sustanbility.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.imagePublicId) await cloudinary.uploader.destroy(record.imagePublicId);

    await Sustanbility.findByIdAndDelete(req.params.id);

    res.json({ message: "Record deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err.message });
  }
};
