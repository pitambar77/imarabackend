
// import Package from "../../models/Packages/Package.js";
// import cloudinary from "../../config/cloudinary.js";

// // Helper function
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

// export const createPackage = async (req, res) => {
//   try {
//     // Parse formData JSON (contains title, subtitle, overview fields, etc.)
//     const formDataParsed = JSON.parse(req.body.formData);

//     // Images
//     const mainImage = req.files?.mainImage?.[0]?.path || null;
//     const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];
//     const experienceImages = req.files?.experienceImages?.map((f) => f.path) || [];

//     // Parse arrays
//     const parsedItinerary = safeParse(req.body.itinerary).map((item, i) => ({
//       ...item,
//       image: itineraryImages[i] || item.image || null,
//     }));

//     const parsedExperience = safeParse(req.body.experience).map((item, i) => ({
//       ...item,
//       image: experienceImages[i] || item.image || null,
//     }));

//     // Create package document
//     const newPackage = await Package.create({
//       ...formDataParsed,       // Contains overviewTitle, overviewSubTitle, overviewDescription, etc.
//       image: mainImage,
//       itinerary: parsedItinerary,
//       experience: parsedExperience,
//       include: safeParse(req.body.include),
//       exclude: safeParse(req.body.exclude),
//       aboutBooking: safeParse(req.body.qa),
//     });

//     res.status(201).json({
//       message: "✅ Package created successfully",
//       package: newPackage,
//     });

//   } catch (err) {
//     console.error("❌ Error creating package:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * Get All Packages
//  */
// export const getAllPackages = async (req, res) => {
//   try {
//     const packages = await Package.find();
//     res.json(packages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching packages", error: error.message });
//   }
// };

// /**
//  * Get Single Package by ID
//  */
// export const getPackageById = async (req, res) => {
//   try {
//     const packageData = await Package.findById(req.params.id);
//     if (!packageData) return res.status(404).json({ message: "Package not found" });

//     res.json(packageData);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching package", error: error.message });
//   }
// };

// /**
//  * Update Package
//  */
// // export const updatePackage = async (req, res) => {
// //   try {
// //     let packageData = await Package.findById(req.params.id);
// //     if (!packageData) return res.status(404).json({ message: "Package not found" });

// //     if (req.file) {
// //       if (packageData.imagePublicId) {
// //         await cloudinary.uploader.destroy(packageData.imagePublicId);
// //       }

// //       packageData.image = req.file.path;
// //       packageData.imagePublicId = req.file.filename;
// //     }

// //     Object.assign(packageData, req.body);
// //     await packageData.save();

// //     res.json({ message: "Package updated successfully", package: packageData });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error updating package", error: error.message });
// //   }
// // };

// export const updatePackage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let updateData = req.body;

//     updateData.include = safeParse(updateData.include);
//     updateData.exclude = safeParse(updateData.exclude);
//     updateData.aboutBooking = safeParse(updateData.qa);

//     const itineraryImages = req.files?.itineraryImages?.map(f => f.path) || [];
//     const experienceImages = req.files?.experienceImages?.map(f => f.path) || [];

//     if (updateData.itinerary) {
//       const parsedItinerary = safeParse(updateData.itinerary).map((item, i) => ({
//         ...item,
//         image: itineraryImages[i] || item.image || null,
//       }));
//       updateData.itinerary = parsedItinerary;
//     }

//     if (updateData.experience) {
//       const parsedExperience = safeParse(updateData.experience).map((item, i) => ({
//         ...item,
//         image: experienceImages[i] || item.image || null,
//       }));
//       updateData.experience = parsedExperience;
//     }

//     if (req.files?.mainImage?.length) {
//       updateData.image = req.files.mainImage[0].path;
//     }

//     const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     res.json({ message: "Package updated successfully", package: updatedPackage });

//   } catch (err) {
//     console.error("❌ Error updating package:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// /**
//  * Delete Package
//  */
// export const deletePackage = async (req, res) => {
//   try {
//     const packageData = await Package.findById(req.params.id);
//     if (!packageData) return res.status(404).json({ message: "Package not found" });

//     if (packageData.imagePublicId) {
//       await cloudinary.uploader.destroy(packageData.imagePublicId);
//     }

//     await Package.findByIdAndDelete(req.params.id);

//     res.json({ message: "Package deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting package", error: error.message });
//   }
// };


import Package from "../../models/Packages/Package.js";
import cloudinary from "../../config/cloudinary.js";

/* ================= SAFE JSON PARSE ================= */
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

/* ===================================================
   CREATE PACKAGE
=================================================== */
export const createPackage = async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData);

    /* ---------- MAIN IMAGE ---------- */
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    /* ---------- IMAGE GROUPS ---------- */
    const itineraryImages = req.files?.itineraryImages || [];
    const experienceImages = req.files?.experienceImages || [];
    const includeImages = req.files?.includeImages || [];
    const excludeImages = req.files?.excludeImages || [];
    

    /* ---------- ITINERARY ---------- */
    const itinerary = safeParse(req.body.itinerary).map((itineraryItem) => ({
      ...itineraryItem,
      section: itineraryItem.section?.map((sec, idx) => ({
        ...sec,
        image: itineraryImages[idx]?.path || sec.image || null,
      })) || [],
    }));



    /* ---------- EXPERIENCE ---------- */
    const experience = safeParse(req.body.experience).map((exp) => ({
      ...exp,
      section: exp.section?.map((sec, idx) => ({
        ...sec,
        image: experienceImages[idx]?.path || sec.image || null,
      })) || [],
    }));

    /* ---------- INCLUDE / EXCLUDE ---------- */
    const include = safeParse(req.body.include).map((item, i) => ({
      ...item,
      image: includeImages[i]?.path || item.image || null,
    }));

    const exclude = safeParse(req.body.exclude).map((item, i) => ({
      ...item,
      image: excludeImages[i]?.path || item.image || null,
    }));

    /* ---------- CREATE DOCUMENT ---------- */
    const newPackage = await Package.create({
      ...formData,
      image: mainImage,
      itinerary,
      experience,
      include,
      exclude,
    });

    res.status(201).json({
      message: "✅ Package created successfully",
      package: newPackage,
    });

  } catch (err) {
    console.error("❌ CREATE PACKAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   GET ALL PACKAGES
=================================================== */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   GET PACKAGE BY ID
=================================================== */
export const getPackageById = async (req, res) => {
  try {
    const data = await Package.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Package not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   UPDATE PACKAGE
=================================================== */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = JSON.parse(req.body.formData || "{}");

    const itineraryImages = req.files?.itineraryImages || [];
    const experienceImages = req.files?.experienceImages || [];
    const includeImages = req.files?.includeImages || [];
    const excludeImages = req.files?.excludeImages || [];


   


    /* ---------- ITINERARY ---------- */
    if (req.body.itinerary) {
      updateData.itinerary = safeParse(req.body.itinerary).map((item) => ({
        ...item,
        section: item.section?.map((sec, idx) => ({
          ...sec,
          image: itineraryImages[idx]?.path || sec.image || null,
        })) || [],
      }));
    }



    /* ---------- EXPERIENCE ---------- */
    if (req.body.experience) {
      updateData.experience = safeParse(req.body.experience).map((exp) => ({
        ...exp,
        section: exp.section?.map((sec, idx) => ({
          ...sec,
          image: experienceImages[idx]?.path || sec.image || null,
        })) || [],
      }));
    }

    /* ---------- INCLUDE / EXCLUDE ---------- */
    if (req.body.include) {
      updateData.include = safeParse(req.body.include).map((item, i) => ({
        ...item,
        image: includeImages[i]?.path || item.image || null,
      }));
    }

    if (req.body.exclude) {
      updateData.exclude = safeParse(req.body.exclude).map((item, i) => ({
        ...item,
        image: excludeImages[i]?.path || item.image || null,
      }));
    }

    /* ---------- MAIN IMAGE ---------- */
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updated = await Package.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "✅ Package updated successfully",
      package: updated,
    });

  } catch (err) {
    console.error("❌ UPDATE PACKAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   DELETE PACKAGE
=================================================== */
export const deletePackage = async (req, res) => {
  try {
    const doc = await Package.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Package not found" });

    if (doc.imagePublicId) {
      await cloudinary.uploader.destroy(doc.imagePublicId);
    }
  

    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Package deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

