import Homepage from "../../models/HomePage/Homepage.js";

/* ================= HELPERS ================= */

const safeParse = (value, fallback = []) => {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/* ================= CREATE / UPDATE HOMEPAGE ================= */

export const saveHomepage = async (req, res) => {
  try {
    /* ================= FORM DATA ================= */

    const formData = JSON.parse(req.body?.formData || "{}");

    /* ================= FAQ ================= */

    const faq = safeParse(req.body.faq).map((section) => ({
      title: section.title || "",
      subtitle: section.subtitle || "",

      faqs: (section.faqs || []).map((item) => ({
        question: item.question || "",
        answer: item.answer || "",
      })),
    }));

    /* ================= PAYLOAD ================= */

    const payload = {
      ...formData,

      faq,
    };

    /* ================= FIND EXISTING ================= */

    const existingHomepage = await Homepage.findOne();

    /* ================= UPDATE ================= */

    if (existingHomepage) {
      const updatedHomepage = await Homepage.findByIdAndUpdate(
        existingHomepage._id,
        payload,
        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Homepage updated successfully",
        data: updatedHomepage,
      });
    }

    /* ================= CREATE ================= */

    const createdHomepage = await Homepage.create(payload);

    res.status(201).json({
      success: true,
      message: "Homepage created successfully",
      data: createdHomepage,
    });
  } catch (error) {
    console.error("❌ HOMEPAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET HOMEPAGE ================= */

export const getHomepage = async (req, res) => {
  try {
    const homepage = await Homepage.findOne().sort({
      createdAt: -1,
    });

    if (!homepage) {
      return res.status(200).json({});
    }

    res.status(200).json(homepage);
  } catch (error) {
    console.error("❌ GET HOMEPAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
