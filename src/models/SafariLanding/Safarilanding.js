// import mongoose from "mongoose";

// const contentBlockSchema = new mongoose.Schema({
//   type: { type: String, enum: ["header", "paragraph", "list"], required: true },
//   content: { type: mongoose.Schema.Types.Mixed, required: true },
// });

// const qaSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
// });

// const faqSectionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   subtitle: { type: String },
//   faqs: [qaSchema], // multiple questions inside one section
// });

// const safarilandingSchema = new mongoose.Schema(
//   {
//     title: String,
//     subtitle: String,
//     bannerImage: String,
//     faq:[faqSectionSchema]
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Safarilanding", safarilandingSchema);



import mongoose from "mongoose";

const overviewinfoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      default: "",
    },
    image: String,
    imagePublicId: { type: String },
  },
  { _id: false },
);

const routeSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    image: String,
    imagePublicId: { type: String },
  },
  { _id: false },
);

const adventureSchema = new mongoose.Schema(
  {
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
  },
  { _id: false },
);

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const whenvisitSchema = new mongoose.Schema(
  {
    heading: String,
    months: [
      {
        monthname: String,
        title: String,
        description: {
          type: String,
          default: "",
        },
        image: String, // added image
        imagePublicId: String,
      },
    ],
  },
  { _id: false },
);

const travelguideSchema = new mongoose.Schema(
  {
    heading: String,

    subtitle: String,

    description: {
      type: String,
      default: "",
    },

    section: [
      new mongoose.Schema(
        {
          title: String,

          description: {
            type: String,
            default: "",
          },

          url: String,

          image: String,

          imagePublicId: String,
        },
        { _id: false },
      ),
    ],
  },
  { _id: false },
);

const relatedsectionSchema = new mongoose.Schema(
  {
    heading: String,

    subtitle: String,

    section: [
      new mongoose.Schema(
        {
          title: String,

          subtitle: String,

          description: {
            type: String,
            default: "",
          },

          image: String,

          imagePublicId: String,
        },
        { _id: false },
      ),
    ],
  },
  { _id: false },
);

const safarilandingSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    overviewinfo: [overviewinfoSchema],
    route: [routeSchema], //add
    adventure: [adventureSchema],
    faq: [qaSchema],
    whenvisit: [whenvisitSchema],
    travelguide: [travelguideSchema],
    relatedsection: [relatedsectionSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Safarilanding", safarilandingSchema);
