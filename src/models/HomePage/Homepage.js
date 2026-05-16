import mongoose from "mongoose";

/* ================= FAQ ITEM ================= */

const qaSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },

    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* ================= FAQ SECTION ================= */

const faqSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    faqs: {
      type: [qaSchema],
      default: [],
    },
  },
  { _id: false },
);

/* ================= HOMEPAGE ================= */

const homepageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    faq: {
      type: [faqSectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Homepage =
  mongoose.models.Homepage || mongoose.model("Homepage", homepageSchema);

export default Homepage;
