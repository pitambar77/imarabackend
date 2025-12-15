import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: [contentBlockSchema],

});

const adventureSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  imagePublicId: { type: String },
});

const effectiveSchema = new mongoose.Schema({
    heading:String,
    title:String,
    description:String,
    image:String,
    imagePublicId: { type: String },
})

const whyvisitSchema = new mongoose.Schema({
    heading:String,
    title:String,
    description:String,
    image:String,
    imagePublicId: { type: String },
})

const sustanbilitySchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    overviewinfo: [overviewinfoSchema],

    adventure: [adventureSchema],
    effective:[effectiveSchema],
    whyvisit:[whyvisitSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Sustanbility", sustanbilitySchema);
