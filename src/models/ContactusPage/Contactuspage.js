import mongoose from "mongoose";

const contactuspageSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    bannerImage: String
  },
  { timestamps: true }
);

export default mongoose.model("Contactuspage", contactuspageSchema);