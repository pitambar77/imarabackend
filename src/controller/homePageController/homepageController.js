

import Homepage from "../../models/HomePage/Homepage.js";

/* SAFE PARSE (reuse everywhere) */
const safeParse = (value) => {
  if (!value) return [];
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const transformFaq = (faqSections) => {
  return faqSections?.map((section) => ({
    ...section.toObject?.() || section,

    faqs: (section.faqs || []).map((faq) => ({
      ...faq.toObject?.() || faq,

      answerBlocks: (faq.answer || []).map((block) => {
        if (block.type === "list") {
          return {
            type: "list",
            items: Array.isArray(block.content)
              ? block.content
              : [block.content],
          };
        }

        return {
          type: block.type === "header" ? "heading" : block.type,
          text: block.content,
        };
      }),

      // optional: hide original field
      // answer: undefined,
    })),
  }));
};

/* FORMAT FAQ STRUCTURE */
const formatFaq = (faqData) => {
  return safeParse(faqData).map((section) => ({
    title: section.title,
    subtitle: section.subtitle || "",
    faqs: (section.faqs || []).map((item) => ({
      question: item.question,
      answer: (item.answer || []).map((block) => ({
        type: block.type,
        content: block.content,
      })),
    })),
  }));
};

/* GET PAGE DATA */
export const getHomepage = async (req, res) => {
  try {
    const data = await Homepage.findOne();

    if (!data) return res.json({});

    const transformed = {
      ...data.toObject(),
      faq: transformFaq(data.faq),
    };

    res.json(transformed);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE / UPDATE PAGE */
export const saveHomepage = async (req, res) => {
  try {
    const { title, subtitle, bannerImage } = req.body;

    // ✅ parse FAQ properly
    const parsedFaq = formatFaq(req.body.faq);

    const existing = await Homepage.findOne();

    const payload = {
      title,
      subtitle,
      bannerImage,
      faq: parsedFaq,
    };

    if (existing) {
      const updated = await Homepage.findByIdAndUpdate(existing._id, payload, {
        new: true,
        runValidators: true,
      });

      return res.json({
        message: "Homepage updated successfully",
        data: updated,
      });
    }

    const created = await Homepage.create(payload);

    res.status(201).json({
      message: "Homepage created successfully",
      data: created,
    });
  } catch (error) {
    console.error("❌ HOMEPAGE ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};
