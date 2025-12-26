import mongoose from "mongoose";

const contactkiliSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    updates: { type: Boolean, default: false },
    privacy: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contactkili", contactkiliSchema);
