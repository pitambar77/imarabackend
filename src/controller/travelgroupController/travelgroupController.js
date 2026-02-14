import Travelgroup from "../../models/Traelgroup/Travelgroup.js";
import cloudinary from "../../config/cloudinary.js";
import slugify from "slugify";
import Seo from "../../models/Seo/Seo.js";

// Safely parse JSON fields
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
 * CREATE TRAVEL GROUP
 */
export const createTravelgroup = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    // File uploads
    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];
    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

    // Parse arrays
    const parsedOverviewInfo = safeParse(req.body.overviewinfo).map((item, i) => ({
      ...item,
      image: overviewImages[i] || item.image || null,
    }));

    const parsedAdventure = safeParse(req.body.adventure).map((item, i) => ({
      ...item,
      image: adventureImages[i] || item.image || null,
    }));

    const parsedQA = safeParse(req.body.qa);

    //slug added

    const generatedSlug = slugify(formDataParsed.category || formDataParsed.title, {
  lower: true,
  strict: true
});

    const newTravelGroup = await Travelgroup.create({
      ...formDataParsed,
      slug: generatedSlug,
      image: mainImage,
      overviewinfo: parsedOverviewInfo,
      adventure: parsedAdventure,
      aboutBooking: parsedQA,
    });

    res.status(201).json({
      message: "Travel Group created successfully",
      data: newTravelGroup,
    });

  } catch (error) {
    console.error("❌ Create Travel Group Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * GET ALL
 */
export const getAllTravelgroups = async (req, res) => {
  try {
    const data = await Travelgroup.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching list", error: err.message });
  }
};


/**
 * GET SINGLE
 * ===========================
 */
export const getTravelgroupById = async (req, res) => {
  try {
    const item = await Travelgroup.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });

     const seoData = await Seo.findOne({
          referenceId: item._id,
          referenceType: "travelgroup",
        });
    
       res.json({
          ...item.toObject(),   // 👈 spread main document
          seo: seoData || null,        // 👈 attach seo inside
        });
    

    // res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching record", error: err.message });
  }
};


/**
 * UPDATE
 */
export const updateTravelgroup = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;

    updateData.overviewinfo = safeParse(updateData.overviewinfo);
    updateData.adventure = safeParse(updateData.adventure);
    updateData.aboutBooking = safeParse(updateData.qa);

    const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];
    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

    if (updateData.overviewinfo) {
      updateData.overviewinfo = updateData.overviewinfo.map((item, i) => ({
        ...item,
        image: overviewImages[i] || item.image || null,
      }));
    }

    if (updateData.adventure) {
      updateData.adventure = updateData.adventure.map((item, i) => ({
        ...item,
        image: adventureImages[i] || item.image || null,
      }));
    }

    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updatedGroup = await Travelgroup.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Travel Group updated successfully", data: updatedGroup });

  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE
 */
export const deleteTravelgroup = async (req, res) => {
  try {
    const item = await Travelgroup.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await Seo.deleteOne({
          referenceId: item.id,
          referenceType: "travelgroup",
        });

    await Travelgroup.findByIdAndDelete(req.params.id);

    res.json({ message: "Travel Group deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err.message });
  }
};
