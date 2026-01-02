import mongoose from "mongoose";

const footerFormSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    privacy: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("FooterForm", footerFormSchema);
