import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Destination from "./models/DestinationDetails/Destinationdetails.js";
import Package from "./models/Packages/Package.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const updateSlugs = async () => {
  try {
    const destinations = await Destination.find();

    for (let item of destinations) {
      if (!item.slug) {
        item.slug = slugify(item.title, { lower: true, strict: true });
        await item.save();
        console.log("Updated:", item.title);
      }
    }

    const packages = await Package.find();

    for (let item of packages) {
      if (!item.slug) {
        item.slug = slugify(item.title, { lower: true, strict: true });
        await item.save();
        console.log("Updated:", item.title);
      }
    }

    console.log("All slugs updated successfully ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateSlugs();