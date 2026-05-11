// above is corrected

import mongoose from "mongoose";

const { Schema } = mongoose;

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

// const contentBlockSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: [
//       // OLD TYPES
//       "header",
//       "paragraph",
//       "list",

//       // NEW TYPES
//       "text",
//       "bold",
//       "italic",
//       "underline",
//       "highlight",
//       "link",
//       "heading",
//       "quote",
//       "bullet",
//       "number",
//     ],
//     default: "text",
//   },

//   // OLD DATA SUPPORT
//   content: {
//     type: mongoose.Schema.Types.Mixed,
//     default: "",
//   },

//   // NEW DATA SUPPORT
//   value: {
//     type: String,
//     default: "",
//   },

//   // FOR LINKS
//   url: {
//     type: String,
//     default: "",
//   },
// });

/* ===========================
   INLINE CONTENT
=========================== */
// const InlineContentSchema = new Schema(
//   {
//     type: {
//       type: String,
//       enum: ["text", "link", "bold", "highlight"],
//       required: true,
//     },
//     value: String,
//     url: String,
//   },
//   { _id: false },
// );

const overviewinfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  // ✅ Rich text paragraph support
  // description: {
  //   type: [[InlineContentSchema]],
  //   default: [],
  // },
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
  subtitle: String, //new
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
  subtitle: String, //new
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

// const migrationSchema = new mongoose.Schema({
//   title: String,
//   subtitle: String,
//   description: {
//     type: [[InlineContentSchema]],
//     default: [],
//   },
//   section: [
//     {
//       nationalpark: String,
//       details: {
//         type: [[InlineContentSchema]],
//         default: [],
//       },
//       image: String,
//       imagePublicId: String,
//     },
//   ],
// });

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

const destinationdetailsSchema = new mongoose.Schema(
  {
    //   destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    title: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: String,
    destination: String,
    image: String,
    imagePublicId: String,
    landingImage: String,
    landingImagePublicId: String,

    aboutBooking: [qaSchema],
    highlight: [highlightsSchema],
    besttime: [besttimeSchema],
    overviewinfo: [overviewinfoSchema],
    migration: [migrationSchema],
    adventure: [adventureSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Destinationdetails", destinationdetailsSchema);
