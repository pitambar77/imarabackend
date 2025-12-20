// import Destinationdetails from "../../models/DestinationDetails/Destinationdetails.js";
// import cloudinary from "../../config/cloudinary.js";

// // Helper function (for parsing JSON / arrays / dynamic blocks)
// const safeParse = (value) => {
//   if (!value) return [];
//   try {
//     return JSON.parse(value);
//   } catch {
//     if (typeof value === "string")
//       return value.split(",").map((v) => v.trim()).filter(Boolean);
//     return [];
//   }
// };

// /**
//  * CREATE Destination Details
//  */
// export const createDestinationdetails = async (req, res) => {
//   try {
//     // Parse main formData JSON from frontend
//     const formDataParsed = JSON.parse(req.body.formData); // contains basic info

//     // Uploaded images mapping
//     const mainImage = req.files?.mainImage?.[0]?.path || null;

//     const overviewImages = req.files?.overviewImages?.map(f => f.path) || [];
//     const highlightImages = req.files?.highlightImages?.map(f => f.path) || [];
//     const migrationImages = req.files?.migrationImages?.map(f => f.path) || [];
//     const adventureImages = req.files?.adventureImages?.map(f => f.path) || [];

//     // Parse dynamic sections and attach images
//     const parsedOverviewInfo = safeParse(req.body.overviewinfo).map((item, i) => ({
//       ...item,
//       image: overviewImages[i] || item.image || null,
//     }));

//     const parsedHighlights = safeParse(req.body.highlight).map((item, i) => ({
//       ...item,
//       image: highlightImages[i] || item.image || null,
//     }));

//     const parsedMigration = safeParse(req.body.migration).map((item, i) => ({
//       ...item,
//       image: migrationImages[i] || item.image || null,
//     }));

//     const parsedAdventure = safeParse(req.body.adventure).map((item, i) => ({
//       ...item,
//       image: adventureImages[i] || item.image || null,
//     }));

//     // Create document
//     const newDestination = await Destinationdetails.create({
//       ...formDataParsed,
//       image: mainImage,
//       overviewinfo: parsedOverviewInfo,
//       highlight: parsedHighlights,
//       migration: parsedMigration,
//       besttime: safeParse(req.body.besttime),
//       aboutBooking: safeParse(req.body.qa),
//       adventure: parsedAdventure,
//     });

//     res.status(201).json({
//       message: "Destination details created successfully",
//       data: newDestination,
//     });

//   } catch (err) {
//     console.error("❌ Error creating destination:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * GET ALL
//  */
// export const getAllDestinationdetails = async (req, res) => {
//   try {
//     const destinations = await Destinationdetails.find().sort({ createdAt: -1 });
//     res.json(destinations);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching destination list", error: error.message });
//   }
// };

// /**
//  * GET SINGLE
//  */
// export const getDestinationdetailsById = async (req, res) => {
//   try {
//     const destination = await Destinationdetails.findById(req.params.id);
//     if (!destination) return res.status(404).json({ message: "Destination not found" });

//     res.json(destination);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching destination", error: error.message });
//   }
// };

// /**
//  * UPDATE Destination
//  */
// export const updateDestinationdetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let updateData = req.body;

//     // Parse dynamic arrays
//     updateData.overviewinfo = safeParse(updateData.overviewinfo);
//     updateData.highlight = safeParse(updateData.highlight);
//     updateData.migration = safeParse(updateData.migration);
//     updateData.besttime = safeParse(updateData.besttime);
//     updateData.aboutBooking = safeParse(updateData.qa);
//     updateData.adventure = safeParse(updateData.adventure);

//     // Update image files
//     const overviewImages = req.files?.overviewImages?.map(f => f.path) || [];
//     const highlightImages = req.files?.highlightImages?.map(f => f.path) || [];
//     const migrationImages = req.files?.migrationImages?.map(f => f.path) || [];
//     const adventureImages = req.files?.adventureImages?.map(f => f.path) || [];

//     if (updateData.overviewinfo) {
//       updateData.overviewinfo = updateData.overviewinfo.map((item, i) => ({
//         ...item,
//         image: overviewImages[i] || item.image || null,
//       }));
//     }

//     if (updateData.highlight) {
//       updateData.highlight = updateData.highlight.map((item, i) => ({
//         ...item,
//         image: highlightImages[i] || item.image || null,
//       }));
//     }

//     if (updateData.migration) {
//       updateData.migration = updateData.migration.map((item, i) => ({
//         ...item,
//         image: migrationImages[i] || item.image || null,
//       }));
//     }

//     if (updateData.adventure) {
//       updateData.adventure = updateData.adventure.map((item, i) => ({
//         ...item,
//         image: adventureImages[i] || item.image || null,
//       }));
//     }

//     if (req.files?.mainImage?.length) {
//       updateData.image = req.files.mainImage[0].path;
//     }

//     const updatedDestination = await Destinationdetails.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res.json({ message: "Destination updated successfully", data: updatedDestination });

//   } catch (err) {
//     console.error("❌ Error updating destination:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * DELETE
//  */
// export const deleteDestinationdetails = async (req, res) => {
//   try {
//     const destination = await Destinationdetails.findById(req.params.id);
//     if (!destination) return res.status(404).json({ message: "Destination not found" });

//     if (destination.imagePublicId) {
//       await cloudinary.uploader.destroy(destination.imagePublicId);
//     }

//     await Destinationdetails.findByIdAndDelete(req.params.id);

//     res.json({ message: "Destination deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting destination", error: error.message });
//   }
// };

// correct above code


// import Destinationdetails from "../../models/DestinationDetails/Destinationdetails.js";
// import cloudinary from "../../config/cloudinary.js";

// /* ================= HELPERS ================= */

// const safeParse = (value, fallback = []) => {
//   if (!value) return fallback;
//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// /* ================= CREATE ================= */

// export const createDestinationdetails = async (req, res) => {
//   try {
//     const formData = JSON.parse(req.body.formData || "{}");

//     /* ---------- MAIN IMAGE ---------- */
//     const mainImage = req.files?.mainImage?.[0]?.path || null;
//     const mainImagePublicId = req.files?.mainImage?.[0]?.filename || null;

//     /* ---------- FILE GROUPS ---------- */
//     const overviewImages = req.files?.overviewImages || [];
//     const highlightImages = req.files?.highlightImages || [];
//     const migrationImages = req.files?.migrationImages || [];
//     const adventureImages = req.files?.adventureImages || [];

//     /* ---------- OVERVIEW ---------- */
//     const overviewinfo = safeParse(req.body.overviewinfo).map((item, i) => ({
//       ...item,
//       image: overviewImages[i]?.path || item.image || null,
//       imagePublicId: overviewImages[i]?.filename || item.imagePublicId || null,
//     }));

//     /* ---------- HIGHLIGHTS (NESTED SECTION) ---------- */
//     const highlight = safeParse(req.body.highlight).map((block) => ({
//       heading: block.heading,
//       section: block.section.map((sec, i) => ({
//         ...sec,
//         image: highlightImages[i]?.path || sec.image || null,
//         imagePublicId: highlightImages[i]?.filename || sec.imagePublicId || null,
//       })),
//     }));

//     /* ---------- MIGRATION (NESTED SECTION) ---------- */
//     const migration = safeParse(req.body.migration).map((block) => ({
//       title: block.title,
//       subtitle: block.subtitle,
//       description: block.description,
//       section: block.section.map((sec, i) => ({
//         ...sec,
//         image: migrationImages[i]?.path || sec.image || null,
//         imagePublicId: migrationImages[i]?.filename || sec.imagePublicId || null,
//       })),
//     }));

//     /* ---------- ADVENTURE ---------- */
//     const adventure = safeParse(req.body.adventure).map((item, i) => ({
//       ...item,
//       image: adventureImages[i]?.path || item.image || null,
//       imagePublicId: adventureImages[i]?.filename || item.imagePublicId || null,
//     }));

//     /* ---------- CREATE ---------- */
//     const destination = await Destinationdetails.create({
//       ...formData,
//       image: mainImage,
//       imagePublicId: mainImagePublicId,
//       overviewinfo,
//       highlight,
//       migration,
//       adventure,
//       besttime: safeParse(req.body.besttime),
//       aboutBooking: safeParse(req.body.qa),
//     });

//     res.status(201).json({
//       message: "Destination details created successfully",
//       data: destination,
//     });

//   } catch (err) {
//     console.error("❌ CREATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= GET ALL ================= */

// export const getAllDestinationdetails = async (req, res) => {
//   try {
//     const data = await Destinationdetails.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= GET SINGLE ================= */

// export const getDestinationdetailsById = async (req, res) => {
//   try {
//     const data = await Destinationdetails.findById(req.params.id);
//     if (!data) return res.status(404).json({ message: "Not found" });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= UPDATE ================= */

// export const updateDestinationdetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = JSON.parse(req.body.formData || "{}");

//     /* ---------- FILE GROUPS ---------- */
//     const overviewImages = req.files?.overviewImages || [];
//     const highlightImages = req.files?.highlightImages || [];
//     const migrationImages = req.files?.migrationImages || [];
//     const adventureImages = req.files?.adventureImages || [];

//     /* ---------- OVERVIEW ---------- */
//     if (req.body.overviewinfo) {
//       updateData.overviewinfo = safeParse(req.body.overviewinfo).map((item, i) => ({
//         ...item,
//         image: overviewImages[i]?.path || item.image || null,
//         imagePublicId: overviewImages[i]?.filename || item.imagePublicId || null,
//       }));
//     }

//     /* ---------- HIGHLIGHTS ---------- */
//     if (req.body.highlight) {
//       updateData.highlight = safeParse(req.body.highlight).map((block) => ({
//         heading: block.heading,
//         section: block.section.map((sec, i) => ({
//           ...sec,
//           image: highlightImages[i]?.path || sec.image || null,
//           imagePublicId: highlightImages[i]?.filename || sec.imagePublicId || null,
//         })),
//       }));
//     }

//     /* ---------- MIGRATION ---------- */
//     if (req.body.migration) {
//       updateData.migration = safeParse(req.body.migration).map((block) => ({
//         ...block,
//         section: block.section.map((sec, i) => ({
//           ...sec,
//           image: migrationImages[i]?.path || sec.image || null,
//           imagePublicId: migrationImages[i]?.filename || sec.imagePublicId || null,
//         })),
//       }));
//     }

//     /* ---------- ADVENTURE ---------- */
//     if (req.body.adventure) {
//       updateData.adventure = safeParse(req.body.adventure).map((item, i) => ({
//         ...item,
//         image: adventureImages[i]?.path || item.image || null,
//         imagePublicId: adventureImages[i]?.filename || item.imagePublicId || null,
//       }));
//     }

//     /* ---------- MAIN IMAGE ---------- */
//     if (req.files?.mainImage?.length) {
//       updateData.image = req.files.mainImage[0].path;
//       updateData.imagePublicId = req.files.mainImage[0].filename;
//     }

//     updateData.besttime = safeParse(req.body.besttime);
//     updateData.aboutBooking = safeParse(req.body.qa);

//     const updated = await Destinationdetails.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res.json({ message: "Destination updated successfully", data: updated });

//   } catch (err) {
//     console.error("❌ UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= DELETE ================= */

// export const deleteDestinationdetails = async (req, res) => {
//   try {
//     const data = await Destinationdetails.findById(req.params.id);
//     if (!data) return res.status(404).json({ message: "Not found" });

//     if (data.imagePublicId) {
//       await cloudinary.uploader.destroy(data.imagePublicId);
//     }

//     await Destinationdetails.findByIdAndDelete(req.params.id);
//     res.json({ message: "Destination deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

    await Destinationdetails.findByIdAndDelete(req.params.id);

    res.json({ message: "Destination deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
