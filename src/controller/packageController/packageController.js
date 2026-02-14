

import Package from "../../models/Packages/Package.js";
import cloudinary from "../../config/cloudinary.js";
import Seo from "../../models/Seo/Seo.js";

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

     /* ---------- LANDING IMAGE ---------- */
    const landingImage = req.files?.landingImage?.[0]?.path || null;


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
      landingImage: landingImage,
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
    const packageData = await Package.findById(req.params.id);
    if (!packageData) return res.status(404).json({ message: "Package not found" });

    const seoData = await Seo.findOne({
      referenceId: packageData._id,
      referenceType: "package",
    });

   res.json({
      ...packageData.toObject(),   // 👈 spread main document
      seo: seoData || null,        // 👈 attach seo inside
    });

    // res.json(data);
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

    /* ---------- LANDING IMAGE ---------- */
    if (req.files?.landingImage?.length) {
      updateData.landingImage = req.files.landingImage[0].path;
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
  
    if (doc.landingImagePublicId) {
      await cloudinary.uploader.destroy(doc.landingImagePublicId);
    }

    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Package deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

