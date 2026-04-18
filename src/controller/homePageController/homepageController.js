import Homepage from "../../models/HomePage/Homepage.js";

/* GET PAGE DATA */
export const getHomepage = async (req, res) => {
  try {
    const data = await Homepage.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE / UPDATE PAGE */
export const saveHomepage = async (req, res) => {
  try {
    const existing = await Homepage.findOne();

    if (existing) {
      const updated = await Homepage.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const created = await Homepage.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};