import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema({
  day: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  map:{type:String},
  accommodationName: { type: String, required: true },
  image: { type: String },
  imagePublicId: { type: String },
});

// experirnce (Moment)

const experienceSchema = new mongoose.Schema({
    description:String,
    image:String,
    imagePublicId: String,
})

const includeSchema = new mongoose.Schema({
    icon:String,
    content:String,
})
const excludeSchema = new mongoose.Schema({
    icon:String,
    content:String,
})


const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

const packageSchema = new mongoose.Schema({
//   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
  title: String,
  subtitle: String,
  startLocation: String,
  endLocation: String,
  image: String,
  imagePublicId: String,
  duration: String,
  price: String,
  maxpeople: Number,
  description: String,
  overviewTitle: { type: String, required: true },
  overviewSubTitle: { type: String,required:true },
  overviewDescription: { type: String, required: true },

   // Sections
    aboutBooking: [qaSchema],
    
  itinerary: [itineraryItemSchema],
  experience:[experienceSchema],
  include:[includeSchema],
  exclude:[excludeSchema],
 

}, { timestamps: true });

export default mongoose.model("Package", packageSchema);
