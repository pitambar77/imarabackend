import Destinationdetails from "../../models/DestinationDetails/Destinationdetails.js";
import cloudinary from "../../config/cloudinary.js";

// Helper function (for parsing JSON / arrays / dynamic blocks)
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
 * CREATE Destination Details
 */
export const createDestinationdetails = async (req, res) => {
  try {
    // Parse main formData JSON from frontend
    const formDataParsed = JSON.parse(req.body.formData); // contains basic info

    // Uploaded images mapping
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    const overviewImages = req.files?.overviewImages?.map(f => f.path) || [];
    const highlightImages = req.files?.highlightImages?.map(f => f.path) || [];
    const migrationImages = req.files?.migrationImages?.map(f => f.path) || [];
    const adventureImages = req.files?.adventureImages?.map(f => f.path) || [];

    // Parse dynamic sections and attach images
    const parsedOverviewInfo = safeParse(req.body.overviewinfo).map((item, i) => ({
      ...item,
      image: overviewImages[i] || item.image || null,
    }));

    const parsedHighlights = safeParse(req.body.highlight).map((item, i) => ({
      ...item,
      image: highlightImages[i] || item.image || null,
    }));

    const parsedMigration = safeParse(req.body.migration).map((item, i) => ({
      ...item,
      image: migrationImages[i] || item.image || null,
    }));

    const parsedAdventure = safeParse(req.body.adventure).map((item, i) => ({
      ...item,
      image: adventureImages[i] || item.image || null,
    }));

    // Create document
    const newDestination = await Destinationdetails.create({
      ...formDataParsed,
      image: mainImage,
      overviewinfo: parsedOverviewInfo,
      highlight: parsedHighlights,
      migration: parsedMigration,
      besttime: safeParse(req.body.besttime),
      aboutBooking: safeParse(req.body.qa),
      adventure: parsedAdventure,
    });

    res.status(201).json({
      message: "Destination details created successfully",
      data: newDestination,
    });

  } catch (err) {
    console.error("❌ Error creating destination:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL
 */
export const getAllDestinationdetails = async (req, res) => {
  try {
    const destinations = await Destinationdetails.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination list", error: error.message });
  }
};

/**
 * GET SINGLE
 */
export const getDestinationdetailsById = async (req, res) => {
  try {
    const destination = await Destinationdetails.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination", error: error.message });
  }
};

/**
 * UPDATE Destination
 */
export const updateDestinationdetails = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Parse dynamic arrays
    updateData.overviewinfo = safeParse(updateData.overviewinfo);
    updateData.highlight = safeParse(updateData.highlight);
    updateData.migration = safeParse(updateData.migration);
    updateData.besttime = safeParse(updateData.besttime);
    updateData.aboutBooking = safeParse(updateData.qa);
    updateData.adventure = safeParse(updateData.adventure);

    // Update image files
    const overviewImages = req.files?.overviewImages?.map(f => f.path) || [];
    const highlightImages = req.files?.highlightImages?.map(f => f.path) || [];
    const migrationImages = req.files?.migrationImages?.map(f => f.path) || [];
    const adventureImages = req.files?.adventureImages?.map(f => f.path) || [];

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

    if (updateData.migration) {
      updateData.migration = updateData.migration.map((item, i) => ({
        ...item,
        image: migrationImages[i] || item.image || null,
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

    const updatedDestination = await Destinationdetails.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Destination updated successfully", data: updatedDestination });

  } catch (err) {
    console.error("❌ Error updating destination:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE
 */
export const deleteDestinationdetails = async (req, res) => {
  try {
    const destination = await Destinationdetails.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });

    if (destination.imagePublicId) {
      await cloudinary.uploader.destroy(destination.imagePublicId);
    }

    await Destinationdetails.findByIdAndDelete(req.params.id);

    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination", error: error.message });
  }
};
