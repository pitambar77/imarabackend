import Contactuspage from "../../models/ContactusPage/Contactuspage.js";

/* GET PAGE DATA */
export const getContactuspage = async (req, res) => {
  try {
    const data = await Contactuspage.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE / UPDATE PAGE */
export const saveContactuspage = async (req, res) => {
  try {
    const existing = await Contactuspage.findOne();

    if (existing) {
      const updated = await Contactuspage.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const created = await Contactuspage.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};