import mongoose from "mongoose";

const qaSchema = new mongoose.Schema({
  question: { type: String },
  answer: {
    type: String,
    default: "",
  }, // multiple answer parts (header, paragraph, list)
});

const faqSectionSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  faqs: [qaSchema], // multiple questions inside one section
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  description: {
    type: String,
    default: "",
  },
  image: { type: String },
  imagePublicId: { type: String },
});

//highlights

const highlightsSchema = new mongoose.Schema({
  heading: String,
  section: [
    {
      title: String,
      description: String,
      image: String,
      imagePublicId: { type: String },
    },
  ],
});

const besttimeSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: {
    type: String,
    default: "",
  },
  months: [
    {
      month: String,
      content: {
        type: String,
        default: "",
      },
    },
  ],
});

const tabsectionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: {
    type: String,
    default: "",
  },
});

const tanzaniadestinationlandingSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,
    taboverview:[tabsectionSchema],
    highlight: [highlightsSchema],
    besttime: [besttimeSchema],
    overviewinfo: [overviewinfoSchema],
    faq: [faqSectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model(
  "Tanzaniadestinationlanding",
  tanzaniadestinationlandingSchema,
);
