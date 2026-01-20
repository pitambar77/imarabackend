// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "imarakileleni_uploads",
//     resource_type: "auto",
//   }),
// });

// const upload = multer({ storage });
// export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "imarakileleni_uploads",
    resource_type: "auto",
    timeout: 120000, // ✅ 2 minutes Cloudinary timeout
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ 10MB per file (recommended)
  },
});

export default upload;
