import mongoose from "mongoose";

const safarilandingSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    bannerImage: String
  },
  { timestamps: true }
);

export default mongoose.model("Safarilanding", safarilandingSchema);