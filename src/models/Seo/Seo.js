import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    referenceType: {
      type: String,
      required: true, // "destination", "blog", "package"
    },

    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String,
    ogImage: String,

    noIndex: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate SEO per reference
seoSchema.index({ referenceId: 1, referenceType: 1 }, { unique: true });

export default mongoose.model("Seo", seoSchema);
