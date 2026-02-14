import Seo from "../../models/Seo/Seo.js";

// ✅ CREATE SEO
// export const createSEO = async (req, res) => {
//   try {
//     const seo = await Seo.create(req.body);
//     res.status(201).json(seo);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const createSEO = async (req, res) => {
  try {
    const { referenceId, referenceType } = req.body;

    const existing = await Seo.findOne({ referenceId, referenceType });

    if (existing) {
      const updated = await Seo.findByIdAndUpdate(existing._id, req.body, {
        new: true,
      });
      return res.json(updated);
    }

    const seo = await Seo.create(req.body);
    res.status(201).json(seo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ GET SEO BY REFERENCE
export const getSEO = async (req, res) => {
  try {
    const { referenceId, referenceType } = req.query;

    const seo = await Seo.findOne({ referenceId, referenceType });

    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE SEO
export const updateSEO = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Seo.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "SEO not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE SEO
export const deleteSEO = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Seo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "SEO not found" });
    }

    res.json({ message: "SEO deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
