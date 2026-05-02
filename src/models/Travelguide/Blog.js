import mongoose from "mongoose";

const ListItemSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
    children: [
      {
        id: String,
        text: String,
        children: [], // recursive structure
      },
    ],
  },
  { _id: false },
);


const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

const faqSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  faqs: [qaSchema], // multiple questions inside one section
});

const SectionSchema = new mongoose.Schema(
  {
    type: { type: String },
    text: String,
    imageUrl: String,
    imageAlt: String,
    items: [ListItemSchema],
    ctaText: String,
    ctaTitle: String,
    ctaHref: String,
  },
  { _id: false },
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    category: {
      type: String,
    },

    keywords: [{ type: String }],
    thumbnail: { type: String },

    sections: [SectionSchema],
    faq:[faqSectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Blog", BlogSchema);
