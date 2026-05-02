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

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: [contentBlockSchema],
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
  description:[contentBlockSchema],
  months: [
    {
      month: String,
      content: [contentBlockSchema],
    },
  ],
});

const destinationlandingSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    highlight: [highlightsSchema],
    besttime: [besttimeSchema],
    overviewinfo: [overviewinfoSchema],
    faq:[faqSectionSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Destinationlanding", destinationlandingSchema);
