import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: {
    type: String,
    default: "",
  },
  image: String,
  imagePublicId: { type: String },
});

//highlights

const highlightsSchema = new mongoose.Schema({
  heading: String,
  section: [
    {
      title: String,
      description: {
        type: String,
        default: "",
      },
      image: String,
      imagePublicId: { type: String },
    },
  ],
});
const besttimeSchema = new mongoose.Schema({
  title: String,
  section: [
    {
      month: String,
      content: {
        type: String,
        default: "",
      },
    },
  ],
});

const adventureSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: {
    type: String,
    default: "",
  },
  image: String,
  imagePublicId: { type: String },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: {
    type: String,
    default: "",
  }, // multiple answer parts (header, paragraph, list)
});

// Migration (Moment)

const migrationSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: {
    type: String,
    default: "",
  },
  section: [
    {
      nationalpark: String,
      details: {
        type: String,
        default: "",
      },
      image: String,
      imagePublicId: String,
    },
  ],
});

const zanzibarSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    title: String,
    subtitle: String,
    destination: String,
    image: String,
    imagePublicId: String,

    aboutBooking: [qaSchema],
    highlight: [highlightsSchema],
    besttime: [besttimeSchema],
    overviewinfo: [overviewinfoSchema],
    migration: [migrationSchema],
    adventure: [adventureSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Zanzibar", zanzibarSchema);
