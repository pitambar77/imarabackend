import mongoose from "mongoose";

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

const safarilandingSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    bannerImage: String,
    faq:[faqSectionSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Safarilanding", safarilandingSchema);