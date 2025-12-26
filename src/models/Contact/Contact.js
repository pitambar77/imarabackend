import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    country: String,

    travelType: String,
    arrivalDate: String,
    departureDate: String,
    totalDays: Number,

    adults: Number,
    children: Number,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
