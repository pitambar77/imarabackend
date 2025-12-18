import mongoose from "mongoose";


const ListItemSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
    children: [
      {
        id: String,
        text: String,
        children: [] // recursive structure
      }
    ],
  },
  { _id: false }
);


const SectionSchema = new mongoose.Schema({
  type: { type: String },
  text: String,
  imageUrl: String,
  imageAlt: String,
  items:[ListItemSchema],
  ctaText: String,
  ctaTitle:String,
  ctaHref: String,
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle:{type:String,required:true},
  slug: { type: String, required: true, unique: true },

  category: {
    type: String,
    
  },

  keywords: [{ type: String }],
  thumbnail: { type: String },

  sections: [SectionSchema],
}, { timestamps: true });

export default mongoose.model("Blog", BlogSchema);
