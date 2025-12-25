import mongoose from "mongoose";


const overviewSchema = new mongoose.Schema({
    title:String,
    subtitle:String,
    description:String,
})

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: [contentBlockSchema],
  image: String,
  imagePublicId: { type: String },
});


const adventureSchema = new mongoose.Schema({
  heading: String,

  team: [
    {
      title: String,
      subtitle: String,
      description: String,
      image: String,
      imagePublicId: { type: String },
    },
  ],
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});


const aboutSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    overview:[overviewSchema],
    overviewinfo:[overviewinfoSchema],
    adventure: [adventureSchema],
    faq:[qaSchema],
    
  },
  { timestamps: true }
);

export default mongoose.model("About", aboutSchema);
