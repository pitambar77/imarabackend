import Kilimanjarolanding from "../../models/KilimanjaroLanding/Kilimanjarolanding.js";
import cloudinary from "../../config/cloudinary.js";

// Safe JSON parser for arrays
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
 * CREATE KILIMANJARO LANDING
 */
// export const createKilimanjarolanding = async (req, res) => {
//   try {
//     const formDataParsed = JSON.parse(req.body.formData);

//     // Main image
//     const mainImage = req.files?.mainImage?.[0]?.path || null;

//     // Adventure images
//     const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

//     // Overview images
//     const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];

//     // Parse arrays
//     const parsedOverviewInfo = safeParse(req.body.overviewinfo).map((item, i) => ({
//       ...item,
//       image: overviewImages[i] || item.image || null,
//     }));

//     const parsedAdventure = safeParse(req.body.adventure).map((block) => ({
//       ...block,
//       section: block.section.map((inner, i) => ({
//         ...inner,
//         image: adventureImages[i] || inner.image || null,
//       })),
//     }));

//     const parsedFaq = safeParse(req.body.faq);
//     const parsedWhenVisit = safeParse(req.body.whenvisit);

//     const newDoc = await Kilimanjarolanding.create({
//       ...formDataParsed,
//       image: mainImage,
//       overviewinfo: parsedOverviewInfo,
//       adventure: parsedAdventure,
//       faq: parsedFaq,
//       whenvisit: parsedWhenVisit,
//     });

//     res.status(201).json({
//       message: "Kilimanjarolanding created successfully",
//       data: newDoc,
//     });

//   } catch (err) {
//     console.error("❌ CREATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const createKilimanjarolanding = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    const mainImage = req.files?.mainImage?.[0]?.path || null;

    const overviewImages = req.files?.overviewImages || [];
    const routeImages = req.files?.routeImages || [];
    const adventureImages = req.files?.adventureImages || [];
    const whenvisitImages = req.files?.whenvisitImages || [];

    let adventureImgIndex = 0;
    let whenvisitImgIndex = 0;
    let routeImgIndex = 0;

    const parsedOverviewInfo = safeParse(req.body.overviewinfo).map((item, i) => ({
      ...item,
      image: overviewImages[i]?.path || item.image || null,
    }));

    const parsedRoute = safeParse(req.body.route).map((item) => ({
      ...item,
      image: routeImages[routeImgIndex++]?.path || item.image || null,
    }));

    const parsedAdventure = safeParse(req.body.adventure).map((block) => ({
      ...block,
      section: block.section.map((inner) => ({
        ...inner,
        image: adventureImages[adventureImgIndex++]?.path || inner.image || null,
      })),
    }));

    const parsedWhenVisit = safeParse(req.body.whenvisit).map((block) => ({
      ...block,
      months: block.months.map((m) => ({
        ...m,
        image: whenvisitImages[whenvisitImgIndex++]?.path || m.image || null,
      })),
    }));

    const parsedFaq = safeParse(req.body.faq);

    const newDoc = await Kilimanjarolanding.create({
      ...formDataParsed,
      image: mainImage,
      overviewinfo: parsedOverviewInfo,
      route: parsedRoute,
      adventure: parsedAdventure,
      whenvisit: parsedWhenVisit,
      faq: parsedFaq,
    });

    res.status(201).json({
      message: "Kilimanjarolanding created successfully",
      data: newDoc,
    });

  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET ALL
 */
export const getAllKilimanjarolanding = async (req, res) => {
  try {
    const data = await Kilimanjarolanding.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching list", error: err.message });
  }
};


/**
 * GET BY ID
 */
export const getKilimanjarolandingById = async (req, res) => {
  try {
    const page = await Kilimanjarolanding.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Kilimanjarolanding not found" });

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: "Error fetching page", error: err.message });
  }
};


/**
 * UPDATE KILIMANJARO LANDING
 */
// export const updateKilimanjarolanding = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let updateData = req.body;

//     // Parse JSON from raw body
//     updateData.overviewinfo = safeParse(updateData.overviewinfo);
//     updateData.adventure = safeParse(updateData.adventure);
//     updateData.faq = safeParse(updateData.faq);
//     updateData.whenvisit = safeParse(updateData.whenvisit);

//     const overviewImages = req.files?.overviewImages?.map((f) => f.path) || [];
//     const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

//     if (updateData.overviewinfo) {
//       updateData.overviewinfo = updateData.overviewinfo.map((item, i) => ({
//         ...item,
//         image: overviewImages[i] || item.image || null,
//       }));
//     }

//     if (updateData.adventure) {
//       updateData.adventure = updateData.adventure.map((block) => ({
//         ...block,
//         section: block.section.map((inner, i) => ({
//           ...inner,
//           image: adventureImages[i] || inner.image || null,
//         })),
//       }));
//     }

//     // update main
//     if (req.files?.mainImage?.length) {
//       updateData.image = req.files.mainImage[0].path;
//     }

//     const updated = await Kilimanjarolanding.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res.json({ message: "Updated successfully", data: updated });

//   } catch (err) {
//     console.error("❌ UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateKilimanjarolanding = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = JSON.parse(req.body.formData || "{}");

    const overviewImages = req.files?.overviewImages || [];
    const routeImages = req.files?.routeImages || [];
    const adventureImages = req.files?.adventureImages || [];
    const whenvisitImages = req.files?.whenvisitImages || [];

    let adventureImgIndex = 0;
    let whenvisitImgIndex = 0;
    let routeImgIndex = 0;

    updateData.overviewinfo = safeParse(req.body.overviewinfo).map((item, i) => ({
      ...item,
      image: overviewImages[i]?.path || item.image || null,
    }));

    updateData.route = safeParse(req.body.route).map((item) => ({
      ...item,
      image: routeImages[routeImgIndex++]?.path || item.image || null,
    }));

    updateData.adventure = safeParse(req.body.adventure).map((block) => ({
      ...block,
      section: block.section.map((inner) => ({
        ...inner,
        image: adventureImages[adventureImgIndex++]?.path || inner.image || null,
      })),
    }));

    updateData.whenvisit = safeParse(req.body.whenvisit).map((block) => ({
      ...block,
      months: block.months.map((m) => ({
        ...m,
        image: whenvisitImages[whenvisitImgIndex++]?.path || m.image || null,
      })),
    }));

    updateData.faq = safeParse(req.body.faq);

    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updated = await Kilimanjarolanding.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Updated successfully", data: updated });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE
 */
export const deleteKilimanjarolanding = async (req, res) => {
  try {
    const doc = await Kilimanjarolanding.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Kilimanjarolanding not found" });

    if (doc.imagePublicId) {
      await cloudinary.uploader.destroy(doc.imagePublicId);
    }

    await Kilimanjarolanding.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting page", error: err.message });
  }
};
