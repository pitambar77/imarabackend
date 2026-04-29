import mongoose from "mongoose";

const { Schema } = mongoose;

/* ===========================
   🔹 INLINE CONTENT (TEXT + LINK)
=========================== */
const InlineContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["text", "link", "bold", "highlight"],
      required: true,
    },
    value: String,
    url: String, // for link
  },
  { _id: false },
);

/* ===========================
   🔹 IMAGE ITEM
=========================== */
const ImageItemSchema = new Schema(
  {
    url: String,
    alt: String,
  },
  { _id: false },
);

/* ===========================
   🔹 LIST (RECURSIVE)
=========================== */
const ListItemSchema = new Schema(
  {
    id: String,
    text: String,
    children: [], // 👈 temporarily empty
  },
  { _id: false },
);

// ✅ AFTER declaration → add recursion
ListItemSchema.add({
  children: [ListItemSchema],
});

/* ===========================
   🔹 IMAGE + CONTENT BLOCK
=========================== */
const ImageContentItemSchema = new Schema(
  {
    image: ImageItemSchema, // ✅ FIXED
    heading: String,
    subheading: String,
    description: String,
    layout: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },
  },
  { _id: false },
);

/* ===========================
   🔹 FAQ BLOCK
=========================== */
const FAQBlockSchema = new Schema(
  {
    question: String,
    answerBlocks: [
      {
        type: { type: String, enum: ["paragraph", "list", "heading"] },
        text: Schema.Types.Mixed,
        items: [String],
      },
    ],
  },
  { _id: false },
);

/* ===========================
   🔹 MAIN SECTION SCHEMA
=========================== */
const SectionSchema = new Schema(
  {
    type: {
      type: String,

      enum: [
        "heading",
        "paragraph",
        "image",
        "imageGrid",
        "imageContent",
        "highlight",
        "package",
        "review",
        "faq",
        "list", // ✅ NEW
        "cta", // ✅ NEW
      ],
    },

    reviews: {
      type: [
        {
          rating: Number, // 1–5
          text: String,
          name: String,
          country: String,
        },
      ],

      default: undefined,
    },

    /* ===== HEADING ===== */
    text: String,
    level: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
      default: 2,
    },

    /* ===== PARAGRAPH ===== */
    content: {
      type: [[InlineContentSchema]],
      default: undefined,
    },

    /* ===== IMAGE ===== */
    image: ImageItemSchema,

    /* ===== IMAGE GRID ===== */
    images: {
      type: [ImageItemSchema],
      default: undefined,
    },
    columns: {
      type: Number,
      enum: [2, 3, 4],
    },

    /* ===== IMAGE CONTENT ===== */
    title: String,
    sections: {
      type: [ImageContentItemSchema],
      default: undefined,
    },

    /* ===== HIGHLIGHT ===== */
    highlights: {
      type: [
        {
          image: ImageItemSchema,
          title: String,
          description: String,
        },
      ],
      default: undefined,
    },

    /* ===== PACKAGE ===== */
    packageType: {
      type: String,
      enum: ["safari", "kilimanjaro", "zanzibar"],
    },

    /* ===== FAQ ===== */
    faqs: {
      type: [FAQBlockSchema],
      default: undefined,
    },

    /* ===== LIST (MULTI LEVEL) ===== */

    items: {
      type: [ListItemSchema],
      default: undefined,
    },

    /* ===== CTA ===== */
    cta: {
      type: {
        title: String,
        description: String,
        buttonText: String,
        buttonLink: String,
      },
      default: undefined,
    },
  },
  { _id: false, minimize: true },
);

/* ===========================
   🔹 BLOG SCHEMA
=========================== */
const ImarablogSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: String,

    slug: { type: String, required: true, unique: true },

    thumbnail: String,

    author: {
      name: String,
      image: String,
      role: String, // 👈 NEW (Owner, Founder, Guide)
      description: String,

      social: {
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
      },
    },

    date: Date,

    category: String,
    tags: [String],

    sections: [SectionSchema],

    relatedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
    landingDetails: [
      {
        title: String,
        description: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Imarablog ||
  mongoose.model("Imarablog", ImarablogSchema);
