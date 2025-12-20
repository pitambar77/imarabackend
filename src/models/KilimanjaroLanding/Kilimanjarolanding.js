import mongoose from "mongoose";


const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: [contentBlockSchema],
  image: String,
imagePublicId: { type: String },

});

const routeSchema = new mongoose.Schema({
  title:{type:String},
  description:{type:String},
  image: String,
imagePublicId: { type: String },
})

const adventureSchema = new mongoose.Schema({
  heading: String,

  section: [
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

const whenvisitSchema = new mongoose.Schema({
    heading:String,
    months:[
        {
            monthname:String,
            title:String,
            description:[contentBlockSchema],
            image: String, // added image
            imagePublicId: String,
        }
    ]
})


const kilimanjarolandingSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    overviewinfo:[overviewinfoSchema],
    route:[routeSchema], //add 
    adventure: [adventureSchema],
    faq:[qaSchema],
    whenvisit:[whenvisitSchema],
    
  },
  { timestamps: true }
);

export default mongoose.model("Kilimanjarolanding", kilimanjarolandingSchema);
