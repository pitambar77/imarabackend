// import About from "../../models/About/About.js";
// import cloudinary from "../../config/cloudinary.js";

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
//  * CREATE ABOUT
//  */
// export const createAbout = async (req, res) => {
//   try {
//     const formDataParsed = JSON.parse(req.body.formData);

//     const mainImage = req.files?.mainImage?.[0]?.path || null;

//     const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

//     const parsedAdventure = safeParse(req.body.adventure).map((block) => ({
//       ...block,
//       team: block.team.map((inner, i) => ({
//         ...inner,
//         image: adventureImages[i] || inner.image || null,
//       })),
//     }));

//     const parsedOverviewInfo = safeParse(req.body.overviewinfo);
//     const parsedOverview = safeParse(req.body.overview);
//     const parsedFaq = safeParse(req.body.faq);

//     const newAbout = await About.create({
//       ...formDataParsed,
//       image: mainImage,
//       overview: parsedOverview,
//       overviewinfo: parsedOverviewInfo,
//       adventure: parsedAdventure,
//       faq: parsedFaq,
//     });

//     res.status(201).json({
//       message: "About created successfully",
//       about: newAbout,
//     });

//   } catch (err) {
//     console.error("❌ CREATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// /**
//  * GET ALL ABOUT
//  */
// export const getAllAbout = async (req, res) => {
//   try {
//     const data = await About.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching about list", error: err.message });
//   }
// };


// /**
//  * GET SINGLE ABOUT
//  */
// export const getAboutById = async (req, res) => {
//   try {
//     const about = await About.findById(req.params.id);
//     if (!about) return res.status(404).json({ message: "About not found" });

//     res.json(about);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching about", error: err.message });
//   }
// };


// /**
//  * UPDATE ABOUT
//  */
// export const updateAbout = async (req, res) => {
//   try {
//     const { id } = req.params;

//     let updateData = req.body;

//     updateData.overview = safeParse(updateData.overview);
//     updateData.overviewinfo = safeParse(updateData.overviewinfo);
//     updateData.adventure = safeParse(updateData.adventure);
//     updateData.faq = safeParse(updateData.faq);

//     const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];

//     if (updateData.adventure) {
//       updateData.adventure = updateData.adventure.map((block) => ({
//         ...block,
//         team: block.team.map((inner, i) => ({
//           ...inner,
//           image: adventureImages[i] || inner.image || null,
//         })),
//       }));
//     }

//     if (req.files?.mainImage?.length) {
//       updateData.image = req.files.mainImage[0].path;
//     }

//     const updated = await About.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res.json({ message: "About updated successfully", about: updated });

//   } catch (err) {
//     console.error("❌ UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// /**
//  * DELETE ABOUT
//  */
// export const deleteAbout = async (req, res) => {
//   try {
//     const doc = await About.findById(req.params.id);
//     if (!doc) return res.status(404).json({ message: "About not found" });

//     if (doc.imagePublicId) {
//       await cloudinary.uploader.destroy(doc.imagePublicId);
//     }

//     await About.findByIdAndDelete(req.params.id);

//     res.json({ message: "About deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Error deleting about", error: err.message });
//   }
// };


import About from "../../models/About/About.js";
import cloudinary from "../../config/cloudinary.js";

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};



/**
 * CREATE ABOUT
 */
export const createAbout = async (req, res) => {
  try {
    const formData = safeParse(req.body.formData, {});

    const overview = safeParse(req.body.overview);
    const overviewinfo = safeParse(req.body.overviewinfo);
    const adventure = safeParse(req.body.adventure);
    const faq = safeParse(req.body.faq);

    /* ================= IMAGES ================= */
    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const overviewInfoImages = req.files?.overviewInfoImages || [];
    const adventureImages = req.files?.adventureImages || [];

    /* ===== Map overviewinfo images ===== */
    let oiIndex = 0;
    const mappedOverviewInfo = overviewinfo.map((item) => {
      const img = overviewInfoImages[oiIndex++];
      return {
        ...item,
        image: img ? img.path : null,
      };
    });

    /* ===== Map adventure team images ===== */
    let advIndex = 0;
    const mappedAdventure = adventure.map((section) => ({
      ...section,
      team: section.team.map((member) => {
        const img = adventureImages[advIndex++];
        return {
          ...member,
          image: img ? img.path : null,
        };
      }),
    }));

    const about = await About.create({
      ...formData,
      image: mainImage,
      overview,
      overviewinfo: mappedOverviewInfo,
      adventure: mappedAdventure,
      faq,
    });

    res.status(201).json({
      message: "About created successfully",
      about,
    });
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET ALL ABOUT
 */
export const getAllAbout = async (req, res) => {
  try {
    const data = await About.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET SINGLE ABOUT
 */
export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "About not found" });
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/**
 * UPDATE ABOUT
 */
export const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const formData = safeParse(req.body.formData, {});
    const overview = safeParse(req.body.overview);
    const overviewinfo = safeParse(req.body.overviewinfo);
    const adventure = safeParse(req.body.adventure);
    const faq = safeParse(req.body.faq);

    const updateData = {
      ...formData,
      overview,
      faq,
    };

    /* ================= IMAGES ================= */
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    /* ===== Overview Info Images ===== */
    const overviewInfoImages = req.files?.overviewInfoImages || [];
    let oiIndex = 0;

    updateData.overviewinfo = overviewinfo.map((item) => {
      const img = overviewInfoImages[oiIndex++];
      return {
        ...item,
        image: img ? img.path : item.image || null,
      };
    });

    /* ===== Adventure Team Images ===== */
    const adventureImages = req.files?.adventureImages || [];
    let advIndex = 0;

    updateData.adventure = adventure.map((section) => ({
      ...section,
      team: section.team.map((member) => {
        const img = adventureImages[advIndex++];
        return {
          ...member,
          image: img ? img.path : member.image || null,
        };
      }),
    }));

    const updated = await About.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "About updated successfully",
      about: updated,
    });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




/**
 * DELETE ABOUT
 */
export const deleteAbout = async (req, res) => {
  try {
    const doc = await About.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "About not found" });

    if (doc.imagePublicId) {
      await cloudinary.uploader.destroy(doc.imagePublicId);
    }

    await About.findByIdAndDelete(req.params.id);

    res.json({ message: "About deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



