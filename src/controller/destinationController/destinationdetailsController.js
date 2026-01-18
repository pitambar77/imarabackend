

import Destinationdetails from "../../models/DestinationDetails/Destinationdetails.js";
import cloudinary from "../../config/cloudinary.js";

/* ================= HELPERS ================= */

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/* ================= CREATE ================= */

export const createDestinationdetails = async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData || "{}");

    /* ---------- MAIN IMAGE ---------- */
    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const mainImagePublicId = req.files?.mainImage?.[0]?.filename || null;

    /* ---------- LANDING IMAGE ---------- */
const landingImage = req.files?.landingImage?.[0]?.path || null;
const landingImagePublicId = req.files?.landingImage?.[0]?.filename || null;


    /* ---------- FILE GROUPS ---------- */
    const overviewImages = req.files?.overviewImages || [];
    const highlightImages = req.files?.highlightImages || [];
    const migrationImages = req.files?.migrationImages || [];
    const adventureImages = req.files?.adventureImages || [];

    /* ---------- OVERVIEW ---------- */
    let overviewImgIndex = 0;
    const overviewinfo = safeParse(req.body.overviewinfo).map((item) => {
      const img = overviewImages[overviewImgIndex];
      overviewImgIndex++;

      return {
        title: item.title,
        subtitle: item.subtitle,
        description: item.description || [],
        image: img?.path || null,
        imagePublicId: img?.filename || null,
      };
    });

    /* ---------- HIGHLIGHTS ---------- */
    let highlightImgIndex = 0;
    const highlight = safeParse(req.body.highlight).map((block) => ({
      heading: block.heading,
      section: (block.section || []).map((sec) => {
        const img = highlightImages[highlightImgIndex];
        highlightImgIndex++;

        return {
          title: sec.title,
          description: sec.description,
          image: img?.path || null,
          imagePublicId: img?.filename || null,
        };
      }),
    }));

    /* ---------- MIGRATION ---------- */
    let migrationImgIndex = 0;
    const migration = safeParse(req.body.migration).map((block) => ({
      title: block.title,
      subtitle: block.subtitle,
      description: block.description || [],
      section: (block.section || []).map((sec) => {
        const img = migrationImages[migrationImgIndex];
        migrationImgIndex++;

        return {
          nationalpark: sec.nationalpark,
          details: sec.details || [],
          image: img?.path || null,
          imagePublicId: img?.filename || null,
        };
      }),
    }));

    /* ---------- ADVENTURE ---------- */
    let adventureImgIndex = 0;
    const adventure = safeParse(req.body.adventure).map((item) => {
      const img = adventureImages[adventureImgIndex];
      adventureImgIndex++;

      return {
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        image: img?.path || null,
        imagePublicId: img?.filename || null,
      };
    });

    /* ---------- CREATE ---------- */
    const destination = await Destinationdetails.create({
      ...formData,
      image: mainImage,
      imagePublicId: mainImagePublicId,
      landingImage,
  landingImagePublicId,
      overviewinfo,
      highlight,
      migration,
      adventure,
      besttime: safeParse(req.body.besttime),
      aboutBooking: safeParse(req.body.qa),
    });

    res.status(201).json({
      message: "Destination details created successfully",
      data: destination,
    });

  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */

export const getAllDestinationdetails = async (req, res) => {
  try {
    const data = await Destinationdetails.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE ================= */

export const getDestinationdetailsById = async (req, res) => {
  try {
    const data = await Destinationdetails.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */

export const updateDestinationdetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = JSON.parse(req.body.formData || "{}");

    const overviewImages = req.files?.overviewImages || [];
    const highlightImages = req.files?.highlightImages || [];
    const migrationImages = req.files?.migrationImages || [];
    const adventureImages = req.files?.adventureImages || [];

    /* ---------- OVERVIEW ---------- */
    if (req.body.overviewinfo) {
      let idx = 0;
      updateData.overviewinfo = safeParse(req.body.overviewinfo).map((item) => {
        const img = overviewImages[idx];
        idx++;

        return {
          title: item.title,
          subtitle: item.subtitle,
          description: item.description || [],
          image: img?.path || item.image || null,
          imagePublicId: img?.filename || item.imagePublicId || null,
        };
      });
    }

    /* ---------- HIGHLIGHT ---------- */
    if (req.body.highlight) {
      let idx = 0;
      updateData.highlight = safeParse(req.body.highlight).map((block) => ({
        heading: block.heading,
        section: (block.section || []).map((sec) => {
          const img = highlightImages[idx];
          idx++;

          return {
            title: sec.title,
            description: sec.description,
            image: img?.path || sec.image || null,
            imagePublicId: img?.filename || sec.imagePublicId || null,
          };
        }),
      }));
    }

    /* ---------- MIGRATION ---------- */
    if (req.body.migration) {
      let idx = 0;
      updateData.migration = safeParse(req.body.migration).map((block) => ({
        title: block.title,
        subtitle: block.subtitle,
        description: block.description || [],
        section: (block.section || []).map((sec) => {
          const img = migrationImages[idx];
          idx++;

          return {
            nationalpark: sec.nationalpark,
            details: sec.details || [],
            image: img?.path || sec.image || null,
            imagePublicId: img?.filename || sec.imagePublicId || null,
          };
        }),
      }));
    }

    /* ---------- ADVENTURE ---------- */
    if (req.body.adventure) {
      let idx = 0;
      updateData.adventure = safeParse(req.body.adventure).map((item) => {
        const img = adventureImages[idx];
        idx++;

        return {
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          image: img?.path || item.image || null,
          imagePublicId: img?.filename || item.imagePublicId || null,
        };
      });
    }

    /* ---------- MAIN IMAGE ---------- */
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
      updateData.imagePublicId = req.files.mainImage[0].filename;
    }

    /* ---------- LANDING IMAGE ---------- */
if (req.files?.landingImage?.length) {
  updateData.landingImage = req.files.landingImage[0].path;
  updateData.landingImagePublicId = req.files.landingImage[0].filename;
}


    updateData.besttime = safeParse(req.body.besttime);
    updateData.aboutBooking = safeParse(req.body.qa);

    const updated = await Destinationdetails.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Destination updated successfully", data: updated });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */

export const deleteDestinationdetails = async (req, res) => {
  try {
    const data = await Destinationdetails.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    const deleteImages = async (arr = []) => {
      for (const item of arr) {
        if (item.imagePublicId) {
          await cloudinary.uploader.destroy(item.imagePublicId);
        }
      }
    };

    await deleteImages(data.overviewinfo);
    await deleteImages(data.adventure);

    for (const h of data.highlight) {
      await deleteImages(h.section);
    }

    for (const m of data.migration) {
      await deleteImages(m.section);
    }

    if (data.imagePublicId) {
      await cloudinary.uploader.destroy(data.imagePublicId);
    }

    if (data.landingImagePublicId) {
  await cloudinary.uploader.destroy(data.landingImagePublicId);
}


    await Destinationdetails.findByIdAndDelete(req.params.id);

    res.json({ message: "Destination deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
