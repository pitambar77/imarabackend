import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: [contentBlockSchema],
  image: { type: String },
  imagePublicId: { type: String },
});

const adventureSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  imagePublicId: { type: String },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

const travelgroupSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    category: { type: String, required: true },
    slug: { type: String, unique: true },
    image: String,
    imagePublicId: String,

    aboutBooking: [qaSchema],

    overviewinfo: [overviewinfoSchema],

    adventure: [adventureSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Travelgroup", travelgroupSchema);
