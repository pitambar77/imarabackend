import Safarilanding from "../../models/SafariLanding/Safarilanding.js";

/* GET PAGE DATA */
export const getSafarilanding = async (req, res) => {
  try {
    const data = await Safarilanding.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE / UPDATE PAGE */
export const saveSafarilanding = async (req, res) => {
  try {
    const existing = await Safarilanding.findOne();

    if (existing) {
      const updated = await Safarilanding.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const created = await Safarilanding.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};