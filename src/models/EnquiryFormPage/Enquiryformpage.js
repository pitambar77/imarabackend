import mongoose from "mongoose";

const overviewinfoSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const qaSchema = new mongoose.Schema(
  {
    question: { type: String },

    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const faqSectionSchema = new mongoose.Schema(
  {
    title: { type: String },

    subtitle: { type: String },

    faqs: {
      type: [qaSchema],
      default: [],
    },
  },
  { _id: false },
);

const enquiryformpageSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    overviewinfo: [overviewinfoSchema],

    faq: [faqSectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Enquiryformpage", enquiryformpageSchema);