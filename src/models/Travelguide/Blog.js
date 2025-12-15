import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  type: { type: String },
  text: String,
  imageUrl: String,
  imageAlt: String,
  items: [String],
  ctaText: String,
  ctaHref: String,
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },

  category: {
    type: String,
    
  },

  keywords: [{ type: String }],
  thumbnail: { type: String },

  sections: [SectionSchema],
}, { timestamps: true });

export default mongoose.model("Blog", BlogSchema);
