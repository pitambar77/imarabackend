// import mongoose from "mongoose";

// const overviewinfoSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   subtitle: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String },
//   imagePublicId: { type: String },
// });

// //highlights

// const highlightsSchema = new mongoose.Schema({
//     heading:String,
//     title:String,
//     description:String,
//     image:String,
//     imagePublicId: { type: String },
// })
// const besttimeSchema = new mongoose.Schema({
//     title:String,
//     month:String,
//     content:String
// })

// const adventureSchema = new mongoose.Schema({
//     title:String,
//     subtitle:String,
//     description:String,
//     image:String,
//     imagePublicId: { type: String },
// })

// // const includeSchema = new mongoose.Schema({
// //   icon: String,
// //   content: String,
// // });
// // const excludeSchema = new mongoose.Schema({
// //   icon: String,
// //   content: String,
// // });

// const contentBlockSchema = new mongoose.Schema({
//   type: { type: String, enum: ["header", "paragraph", "list"], required: true },
//   content: { type: mongoose.Schema.Types.Mixed, required: true },
// });

// const qaSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
// });

// // Migration (Moment)

// const migrationSchema = new mongoose.Schema({
//   title: String,
//   subtitle: String,
//   description: String,
//   image: String,
//   imagePublicId: String,
//   nationalpark:String,
//   details:[contentBlockSchema]
// });

// const destinationdetailsSchema = new mongoose.Schema(
//   {
//     //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
//     title: String,
//     subtitle: String,
//     destination: String,
//     image: String,
//     imagePublicId: String,
//     // Sections
//     aboutBooking: [qaSchema],
//     highlight:[highlightsSchema],
//     besttime:[besttimeSchema],
//     overviewinfo: [overviewinfoSchema],
//     migration: [migrationSchema],
//     adventure:[adventureSchema],
//     // include: [includeSchema],
//     // exclude: [excludeSchema],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Destinationdetails", destinationdetailsSchema);

// above is corrected

import mongoose from "mongoose";

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
  section: [
    {
      month: String,
      content: String,
    },
  ],
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

// Migration (Moment)

const migrationSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: [contentBlockSchema],
  section: [
    {
      nationalpark: String,
      details: [contentBlockSchema],
      image: String,
      imagePublicId: String,
    },
  ],
});

const destinationdetailsSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    title: String,
    subtitle: String,
    destination: String,
    image: String,
    imagePublicId: String,
    landingImage:String, // add new landing image field
    landingImagePublicId: String,

    aboutBooking: [qaSchema],
    highlight: [highlightsSchema],
    besttime: [besttimeSchema],
    overviewinfo: [overviewinfoSchema],
    migration: [migrationSchema],
    adventure: [adventureSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Destinationdetails", destinationdetailsSchema);
