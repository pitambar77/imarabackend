import Destinationlanding from "../../models/DestinationDetails/Destinationlandind.js";
import cloudinary from "../../config/cloudinary.js";


// Helper JSON parser
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
 * CREATE LANDING DESTINATION
 */
export const createDestinationlanding = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData); // title, subtitle, etc.

    // Image uploads
    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];
    const highlightImages = req.files?.highlightImages?.map((f) => f.path) || [];

    // Process arrays
    const parsedOverview = safeParse(req.body.overviewinfo).map((item, i) => ({
      ...item,
      image: overviewImages[i] || item.image || null,
    }));

    const parsedHighlights = safeParse(req.body.highlight).map((item, i) => ({
      ...item,
      image: highlightImages[i] || item.image || null,
    }));

    const parsedBesttime = safeParse(req.body.besttime); // contains content[]

    const newDestination = await Destinationlanding.create({
      ...formDataParsed,
      image: mainImage,
      overviewinfo: parsedOverview,
      highlight: parsedHighlights,
      besttime: parsedBesttime,
    });

    res.status(201).json({
      message: "Destination Landing Created Successfully",
      data: newDestination,
    });

  } catch (error) {
    console.error("❌ Create Destination Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * GET ALL
 */
export const getAllDestinationlanding = async (req, res) => {
  try {
    const data = await Destinationlanding.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching list", error: err.message });
  }
};


/**
 * GET SINGLE
 */
export const getDestinationlandingById = async (req, res) => {
  try {
    const item = await Destinationlanding.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};


/**
 * UPDATE
 */
export const updateDestinationlanding = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;

    updateData.overviewinfo = safeParse(updateData.overviewinfo);
    updateData.highlight = safeParse(updateData.highlight);
    updateData.besttime = safeParse(updateData.besttime);

    const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];
    const highlightImages = req.files?.highlightImages?.map((f) => f.path) || [];

    if (updateData.overviewinfo) {
      updateData.overviewinfo = updateData.overviewinfo.map((item, i) => ({
        ...item,
        image: overviewImages[i] || item.image || null,
      }));
    }

    if (updateData.highlight) {
      updateData.highlight = updateData.highlight.map((item, i) => ({
        ...item,
        image: highlightImages[i] || item.image || null,
      }));
    }

    // main image update if uploaded
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updated = await Destinationlanding.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Destination Landing Updated Successfully",
      data: updated,
    });

  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE RECORD
 */
export const deleteDestinationlanding = async (req, res) => {
  try {
    const item = await Destinationlanding.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Record not found" });

    if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);

    await Destinationlanding.findByIdAndDelete(req.params.id);

    res.json({ message: "Destination Landing Deleted Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err.message });
  }
};
