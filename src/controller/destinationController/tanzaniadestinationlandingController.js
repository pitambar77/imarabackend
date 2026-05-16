import Tanzaniadestinationlanding from "../../models/DestinationDetails/Tanzaniadestinationlanding.js";
import cloudinary from "../../config/cloudinary.js";

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const formatFaq = (faqData) => {
  return safeParse(faqData).map((section) => ({
    title: section.title || "",

    subtitle: section.subtitle || "",

    faqs: (section.faqs || []).map((item) => ({
      question: item.question || "",

      answer: item.answer || "",
    })),
  }));
};

/**
 * CREATE LANDING DESTINATION
 */

export const createDestinationlanding = async (req, res) => {
  try {
    const formData = safeParse(req.body.formData, {});

    /* ================= MAIN IMAGE ================= */
    const mainImage = req.files?.mainImage?.[0];

    /* ================= OVERVIEW ================= */
    const overviewinfo = safeParse(req.body.overviewinfo).map((item, i) => ({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || "",
      image: req.files?.overviewImages?.[i]?.path || null,
      imagePublicId: req.files?.overviewImages?.[i]?.filename || null,
    }));

    /* ================= HIGHLIGHTS ================= */

    // 1️⃣ Get highlightImages from multer
    const highlightImages = req.files?.highlightImages || [];

    // 2️⃣ Image pointer
    let imgIndex = 0;

    // 3️⃣ Map highlights
    const highlight = safeParse(req.body.highlight).map((hl) => ({
      heading: hl.heading,
      section: hl.section.map((sec) => ({
        title: sec.title,
        description: sec.description,
        image: highlightImages[imgIndex]?.path || null,
        imagePublicId: highlightImages[imgIndex++]?.filename || null,
      })),
    }));

    /* ================= BEST TIME ================= */
    const besttime = safeParse(req.body.besttime).map((bt) => ({
      title: bt.title,
      subtitle: bt.subtitle,
      description: bt.description || "",
      months: bt.months.map((m) => ({
        month: m.month,
        content: m.content || "",
      })),
    }));

    const taboverview = safeParse(req.body.taboverview).map((item) => ({
      title: item.title || "",

      subtitle: item.subtitle || "",

      description: item.description || "",
    }));

    const destination = await Tanzaniadestinationlanding.create({
      ...formData,
      image: mainImage?.path || null,
      imagePublicId: mainImage?.filename || null,
      taboverview,
      overviewinfo,
      highlight,
      besttime,
      faq: formatFaq(req.body.faq),
    });

    res.status(201).json({
      message: "Destination Landing Created Successfully",
      data: destination,
    });
  } catch (error) {
    console.error("❌ CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL
 */

// export const getAllDestinationlanding = async (req, res) => {
//   try {
//     const data = await Destinationlanding.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getAllDestinationlanding = async (req, res) => {
  try {
    const data = await Tanzaniadestinationlanding.find().sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE
 */

export const getDestinationlandingById = async (req, res) => {
  try {
    const item = await Tanzaniadestinationlanding.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Record not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDestinationlanding = async (req, res) => {
  try {
    const { id } = req.params;

    const body = req.body.formData ? JSON.parse(req.body.formData) : req.body;

    const updateData = { ...body };

    /* ================= OVERVIEW ================= */
    updateData.overviewinfo = safeParse(req.body.overviewinfo).map(
      (item, i) => ({
        ...item,
        image: req.files?.overviewImages?.[i]?.path || item.image || null,
        imagePublicId:
          req.files?.overviewImages?.[i]?.filename ||
          item.imagePublicId ||
          null,
      }),
    );

    const highlightImages = req.files?.highlightImages || [];
    let imgIndex = 0;

    updateData.highlight = safeParse(req.body.highlight).map((hl) => ({
      heading: hl.heading,
      section: hl.section.map((sec) => ({
        ...sec,
        image: highlightImages[imgIndex]?.path || sec.image || null,
        imagePublicId:
          highlightImages[imgIndex++]?.filename || sec.imagePublicId || null,
      })),
    }));

    /* ================= TAB OVERVIEW ================= */

    updateData.taboverview = safeParse(req.body.taboverview).map((item) => ({
      title: item.title || "",

      subtitle: item.subtitle || "",

      description: item.description || "",
    }));

    /* ================= BEST TIME ================= */
    updateData.besttime = safeParse(req.body.besttime);
    updateData.faq = formatFaq(req.body.faq);

    /* ================= MAIN IMAGE ================= */
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
      updateData.imagePublicId = req.files.mainImage[0].filename;
    }

    const updated = await Tanzaniadestinationlanding.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({
      message: "Destination Landing Updated Successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDestinationlanding = async (req, res) => {
  try {
    const item = await Tanzaniadestinationlanding.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await Tanzaniadestinationlanding.findByIdAndDelete(req.params.id);

    res.json({ message: "Destination Landing Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
