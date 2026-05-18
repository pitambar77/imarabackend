import Mountkilimanjaro from "../../models/KilimanjaroLanding/Mountkilimanjaro.js";
import cloudinary from "../../config/cloudinary.js";

// Safe JSON parser for arrays
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string")
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    return [];
  }
};

const cleanHTML = (html = "") => {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<xml[^>]*>[\s\S]*?<\/xml>/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sid="[^"]*"/gi, "")
    .replace(/\sdir="[^"]*"/gi, "")
    .replace(/\srole="[^"]*"/gi, "")
    .replace(/\saria-[^=]*="[^"]*"/gi, "")
    .trim();
};

export const createKilimanjarolanding = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    const mainImage = req.files?.mainImage?.[0];

    const overviewImages = req.files?.overviewImages || [];
    const routeImages = req.files?.routeImages || [];
    const adventureImages = req.files?.adventureImages || [];
    const whenvisitImages = req.files?.whenvisitImages || [];
    const travelguideImages = req.files?.travelguideImages || [];
    const relatedsectionImages = req.files?.relatedsectionImages || [];

    let travelguideImgIndex = 0;
    let relatedsectionImgIndex = 0;
    let adventureImgIndex = 0;
    let whenvisitImgIndex = 0;
    let routeImgIndex = 0;

    const parsedOverviewInfo = safeParse(req.body.overviewinfo).map(
      (item, i) => ({
        ...item,

        description: cleanHTML(item.description || ""),

        image: overviewImages[i]?.path || item.image || null,

        imagePublicId:
          overviewImages[i]?.filename || item.imagePublicId || null,
      }),
    );

    const parsedRoute = safeParse(req.body.route).map((item) => ({
      ...item,

      description: cleanHTML(item.description || ""),

      image: routeImages[routeImgIndex]?.path || item.image || null,

      imagePublicId:
        routeImages[routeImgIndex++]?.filename || item.imagePublicId || null,
    }));

    const parsedAdventure = safeParse(req.body.adventure).map((block) => ({
      ...block,

      section: (block.section || []).map((inner) => ({
        ...inner,

        description: cleanHTML(inner.description || ""),

        image: adventureImages[adventureImgIndex]?.path || inner.image || null,

        imagePublicId:
          adventureImages[adventureImgIndex++]?.filename ||
          inner.imagePublicId ||
          null,
      })),
    }));

    const parsedWhenVisit = safeParse(req.body.whenvisit).map((block) => ({
      ...block,

      months: (block.months || []).map((m) => ({
        ...m,

        description: cleanHTML(m.description || ""),

        image: whenvisitImages[whenvisitImgIndex]?.path || m.image || null,

        imagePublicId:
          whenvisitImages[whenvisitImgIndex++]?.filename ||
          m.imagePublicId ||
          null,
      })),
    }));

    const parsedFaq = safeParse(req.body.faq).map((item) => ({
      ...item,

      answer: cleanHTML(item.answer || ""),
    }));

    const parsedTravelguide = safeParse(req.body.travelguide).map((block) => ({
      ...block,

      description: cleanHTML(block.description || ""),

      section: (block.section || []).map((inner) => ({
        ...inner,

        description: cleanHTML(inner.description || ""),

        image:
          travelguideImages[travelguideImgIndex]?.path || inner.image || null,

        imagePublicId:
          travelguideImages[travelguideImgIndex++]?.filename ||
          inner.imagePublicId ||
          null,
      })),
    }));

    const parsedRelatedsection = safeParse(req.body.relatedsection).map(
      (block) => ({
        ...block,

        section: (block.section || []).map((inner) => ({
          ...inner,

          description: cleanHTML(inner.description || ""),

          image:
            relatedsectionImages[relatedsectionImgIndex]?.path ||
            inner.image ||
            null,

          imagePublicId:
            relatedsectionImages[relatedsectionImgIndex++]?.filename ||
            inner.imagePublicId ||
            null,
        })),
      }),
    );

    const newDoc = await Mountkilimanjaro.create({
      ...formDataParsed,
      image: mainImage?.path || null,
      imagePublicId: mainImage?.filename || null,
      overviewinfo: parsedOverviewInfo,
      route: parsedRoute,
      adventure: parsedAdventure,
      whenvisit: parsedWhenVisit,
      faq: parsedFaq,
      travelguide: parsedTravelguide,
      relatedsection: parsedRelatedsection,
    });

    res.status(201).json({
      message: "Mountkilimanjaro created successfully",
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
    const data = await Mountkilimanjaro.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching list", error: err.message });
  }
};

/**
 * GET BY ID
 */
export const getKilimanjarolandingById = async (req, res) => {
  try {
    const page = await Mountkilimanjaro.findById(req.params.id);
    if (!page)
      return res.status(404).json({ message: "Kilimanjarolanding not found" });

    res.json(page);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching page", error: err.message });
  }
};

export const updateKilimanjarolanding = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = JSON.parse(req.body.formData || "{}");

    const overviewImages = req.files?.overviewImages || [];
    const routeImages = req.files?.routeImages || [];
    const adventureImages = req.files?.adventureImages || [];
    const whenvisitImages = req.files?.whenvisitImages || [];
    const relatedsectionImages = req.files?.relatedsectionImages || [];
    const travelguideImages = req.files?.travelguideImages || [];

    let adventureImgIndex = 0;
    let whenvisitImgIndex = 0;
    let routeImgIndex = 0;
    let relatedsectionImgIndex = 0;

    updateData.overviewinfo = safeParse(req.body.overviewinfo).map(
      (item, i) => ({
        ...item,

        description: cleanHTML(item.description || ""),

        image: overviewImages[i]?.path || item.image || null,

        imagePublicId:
          overviewImages[i]?.filename || item.imagePublicId || null,
      }),
    );

    updateData.route = safeParse(req.body.route).map((item) => ({
      ...item,

      description: cleanHTML(item.description || ""),

      image: routeImages[routeImgIndex]?.path || item.image || null,

      imagePublicId:
        routeImages[routeImgIndex++]?.filename || item.imagePublicId || null,
    }));

    updateData.adventure = safeParse(req.body.adventure).map((block) => ({
      ...block,

      section: (block.section || []).map((inner) => ({
        ...inner,

        description: cleanHTML(inner.description || ""),

        image: adventureImages[adventureImgIndex]?.path || inner.image || null,

        imagePublicId:
          adventureImages[adventureImgIndex++]?.filename ||
          inner.imagePublicId ||
          null,
      })),
    }));

    updateData.whenvisit = safeParse(req.body.whenvisit).map((block) => ({
      ...block,

      months: (block.months || []).map((m) => ({
        ...m,

        description: cleanHTML(m.description || ""),

        image: whenvisitImages[whenvisitImgIndex]?.path || m.image || null,

        imagePublicId:
          whenvisitImages[whenvisitImgIndex++]?.filename ||
          m.imagePublicId ||
          null,
      })),
    }));

    updateData.faq = safeParse(req.body.faq).map((item) => ({
      ...item,

      answer: cleanHTML(item.answer || ""),
    }));

    updateData.relatedsection = safeParse(req.body.relatedsection).map(
      (block) => ({
        ...block,

        section: (block.section || []).map((inner) => ({
          ...inner,

          description: cleanHTML(inner.description || ""),

          image:
            relatedsectionImages[relatedsectionImgIndex]?.path ||
            (typeof inner.image === "string" ? inner.image : null),

          imagePublicId:
            relatedsectionImages[relatedsectionImgIndex++]?.filename ||
            inner.imagePublicId ||
            null,
        })),
      }),
    );

    let tgImageIndex = 0;

    updateData.travelguide = safeParse(req.body.travelguide).map((block) => ({
      ...block,

      description: cleanHTML(block.description || ""),

      section: (block.section || []).map((inner) => {
        let image = inner.image || null;
        let imagePublicId = inner.imagePublicId || null;

        // ONLY replace when new image uploaded
        if (inner.hasNewImage && travelguideImages[tgImageIndex]) {
          image = travelguideImages[tgImageIndex].path;
          imagePublicId = travelguideImages[tgImageIndex].filename;

          tgImageIndex++;
        }

        return {
          ...inner,

          description: cleanHTML(inner.description || ""),

          image,
          imagePublicId,
        };
      }),
    }));

    let relatedImageIndex = 0;

    updateData.relatedsection = safeParse(req.body.relatedsection).map(
      (block) => ({
        ...block,

        section: (block.section || []).map((inner) => {
          let image = inner.image || null;
          let imagePublicId = inner.imagePublicId || null;

          // ONLY replace when new image uploaded
          if (inner.hasNewImage && relatedsectionImages[relatedImageIndex]) {
            image = relatedsectionImages[relatedImageIndex].path;

            imagePublicId = relatedsectionImages[relatedImageIndex].filename;

            relatedImageIndex++;
          }

          const { newImage, hasNewImage, imagePreview, ...cleanInner } = inner;

          return {
            ...cleanInner,

            description: cleanHTML(inner.description || ""),

            image,
            imagePublicId,
          };
        }),
      }),
    );

    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;

      updateData.imagePublicId = req.files.mainImage[0].filename;
    }

    const updated = await Mountkilimanjaro.findByIdAndUpdate(id, updateData, {
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
    const doc = await Mountkilimanjaro.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ message: "Kilimanjarolanding not found" });

    if (doc.imagePublicId) {
      await cloudinary.uploader.destroy(doc.imagePublicId);
    }

    await Mountkilimanjaro.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting page", error: err.message });
  }
};
