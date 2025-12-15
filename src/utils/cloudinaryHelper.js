// utils/cloudinaryHelper.js
import cloudinary from "../config/cloudinary.js";

/**
 * Delete an image from Cloudinary using publicId.
 * Accepts either full publicId or file.filename (multer-storage-cloudinary gives filename as publicId).
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    // sometimes publicId includes folder + filename already
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    return res;
  } catch (err) {
    console.warn("Cloudinary deletion failed", err);
    return null;
  }
};
