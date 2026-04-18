import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    bannerImage: String
  },
  { timestamps: true }
);

export default mongoose.model("Homepage", homepageSchema);