import Fleet from "../../models/Fleet/Fleet.js";
import cloudinary from "../../config/cloudinary.js";

// Helper to safely parse JSON
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
 * CREATE FLEET
 */
export const createFleet = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    // Single main image
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    const parsedOverviewInfo = safeParse(req.body.overviewinfo);
    const parsedFaq = safeParse(req.body.faq);

    const newFleet = await Fleet.create({
      ...formDataParsed,
      image: mainImage,
      overviewinfo: parsedOverviewInfo,
      faq: parsedFaq,
    });

    res.status(201).json({
      message: "Fleet created successfully",
      fleet: newFleet,
    });

  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL FLEET
 */
export const getAllFleet = async (req, res) => {
  try {
    const data = await Fleet.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching fleet list", error: err.message });
  }
};

/**
 * GET ONE FLEET BY ID
 */
export const getFleetById = async (req, res) => {
  try {
    const fleet = await Fleet.findById(req.params.id);
    if (!fleet) return res.status(404).json({ message: "Fleet not found" });

    res.json(fleet);
  } catch (err) {
    res.status(500).json({ message: "Error fetching fleet", error: err.message });
  }
};

/**
 * UPDATE FLEET
 */
export const updateFleet = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    updateData.overviewinfo = safeParse(updateData.overviewinfo);
    updateData.faq = safeParse(updateData.faq);

    // Replace main image only if new uploaded
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updated = await Fleet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Fleet updated successfully",
      fleet: updated,
    });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE FLEET
 */
export const deleteFleet = async (req, res) => {
  try {
    const doc = await Fleet.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Fleet not found" });

    if (doc.imagePublicId) await cloudinary.uploader.destroy(doc.imagePublicId);

    await Fleet.findByIdAndDelete(req.params.id);

    res.json({ message: "Fleet deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting fleet", error: err.message });
  }
};
