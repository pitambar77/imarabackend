import mongoose from "mongoose";

const adventureSchema = new mongoose.Schema({
  heading: String,
  adventure: [
    {
      title: String,
      subtitle: String,
      description: String,
      image: String,
      imagePublicId: { type: String },
    },
  ],
});

const profileSchema = new mongoose.Schema({
  title: String,
  description: String,
  profile: [
    {
      name: String,
      location: String,
      image: String,
      imagePublicId: { type: String },
    },
  ],
});

const teamSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    imagePublicId: String,

    adventure: [adventureSchema],
    profile: [profileSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
