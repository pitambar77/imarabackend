// import mongoose from "mongoose";

// const { Schema } = mongoose;

// /* ===========================
//    🔹 IMAGE ITEM
// =========================== */
// const ImageItemSchema = new Schema(
//   {
//     url: String,
//     alt: String,
//   },
//   { _id: false },
// );

// /* ===========================
//    🔹 LIST (RECURSIVE)
// =========================== */
// const ListItemSchema = new Schema(
//   {
//     id: String,
//     text: String,
//     children: [], // 👈 temporarily empty
//   },
//   { _id: false },
// );

// // ✅ AFTER declaration → add recursion
// ListItemSchema.add({
//   children: [ListItemSchema],
// });

// /* ===========================
//    🔹 IMAGE + CONTENT BLOCK
// =========================== */
// const ImageContentItemSchema = new Schema(
//   {
//     image: ImageItemSchema, // ✅ FIXED
//     heading: String,
//     subheading: String,
//     description: String,
//     layout: {
//       type: String,
//       enum: ["left", "right"],
//       default: "left",
//     },
//   },
//   { _id: false },
// );

// /* ===========================
//    🔹 FAQ BLOCK
// =========================== */
// const FAQBlockSchema = new Schema(
//   {
//     question: String,

//     answer: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false },
// );

// /* ===========================
//    🔹 MAIN SECTION SCHEMA
// =========================== */
// const SectionSchema = new Schema(
//   {
//     type: {
//       type: String,

//       enum: [
//         "heading",
//         "paragraph",
//         "image",
//         "imageGrid",
//         "imageContent",
//         "highlight",
//         "package",
//         "review",
//         "faq",
//         "list", // ✅ NEW
//         "cta", // ✅ NEW
//       ],
//     },

//     reviews: {
//       type: [
//         {
//           rating: Number, // 1–5
//           text: String,
//           name: String,
//           country: String,
//         },
//       ],

//       default: undefined,
//     },

//     /* ===== HEADING ===== */
//     text: String,
//     level: {
//       type: Number,
//       enum: [1, 2, 3, 4, 5, 6],
//       default: 2,
//     },

//     /* ===== PARAGRAPH ===== */
//     content: {
//       type: String,
//       default: "",
//     },

//     /* ===== IMAGE ===== */
//     image: ImageItemSchema,

//     /* ===== IMAGE GRID ===== */
//     images: {
//       type: [ImageItemSchema],
//       default: undefined,
//     },
//     columns: {
//       type: Number,
//       enum: [2, 3, 4],
//     },

//     /* ===== IMAGE CONTENT ===== */
//     title: String,
//     sections: {
//       type: [ImageContentItemSchema],
//       default: undefined,
//     },

//     /* ===== HIGHLIGHT ===== */
//     highlights: {
//       type: [
//         {
//           image: ImageItemSchema,
//           title: String,
//           description: String,
//         },
//       ],
//       default: undefined,
//     },

//     destination: String,
//     layout: {
//       type: String,
//       enum: ["grid", "slider"],
//       default: "slider",
//     },
//     btnname: String,
//     btnlink: String,
//     showArrows: {
//       type: Boolean,
//       default: true,
//     },

//     /* ===== FAQ ===== */
//     faqs: {
//       type: [FAQBlockSchema],
//       default: undefined,
//     },

//     /* ===== LIST (MULTI LEVEL) ===== */

//     items: {
//       type: [ListItemSchema],
//       default: undefined,
//     },

//     /* ===== CTA ===== */
//     cta: {
//       type: {
//         title: String,
//         description: String,
//         buttonText: String,
//         buttonLink: String,
//       },
//       default: undefined,
//     },
//   },
//   { _id: false, minimize: true },
// );

// /* ===========================
//    🔹 BLOG SCHEMA
// =========================== */
// const TravelguideSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     subtitle: String,

//     slug: { type: String, required: true, unique: true },

//     thumbnail: String,

//     category: String,
//     tags: [String],

//     sections: [SectionSchema],
//   },
//   { timestamps: true },
// );

// export default mongoose.models.Travlguide ||
//   mongoose.model("Travlguide", TravelguideSchema);

import mongoose from "mongoose";

const ListItemSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
    children: [],
  },
  { _id: false },
);

ListItemSchema.add({
  children: [ListItemSchema],
});

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

const faqSectionSchema = new mongoose.Schema({
  title: { type: String},
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

const TravelguideSchema = new mongoose.Schema(
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
    faq: [faqSectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Travlguide", TravelguideSchema);
