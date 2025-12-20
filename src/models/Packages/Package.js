import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const itineraryItemSchema = new mongoose.Schema({
  heading: { type: String },
  map: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  section: [
    {
      day: { type: String },
      title: { type: String },
      startpoint: { type: String },
      endpoint: { type: String },
      description: [contentBlockSchema],
      accommodationName: { type: String },
      image: { type: String },
      imagePublicId: { type: String },
    },
  ],
});

// experirnce (Moment)

const experienceSchema = new mongoose.Schema({
  heading: { type: String },
  subheading: { type: String },
  section: [
    {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      imagePublicId: { type: String },
    },
  ],
});

const includeSchema = new mongoose.Schema({
  content: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
});
const excludeSchema = new mongoose.Schema({
  content: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
});



const packageSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    destination:String,
    title: String,
    subtitle: String,
    startLocation: String,
    endLocation: String,
    image: String,
    imagePublicId: String,
    duration: String,
    price: String,
    maxpeople: String,
    description: String,
    add:String,
    typeStyle:String,
    accomoType:String,
    transport:String,
    accomoDay:String,
    accomoNight:String,

    itinerary: [itineraryItemSchema],
    experience: [experienceSchema],
    include: [includeSchema],
    exclude: [excludeSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
