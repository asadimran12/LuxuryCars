const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// ------------------------------------
// 1. Configure Cloudinary
// ------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------------------------
// 2. Configure Storage
// ------------------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "luxury-cars",        // Folder name in Cloudinary
      resource_type: "auto",        // IMPORTANT → upload images, videos, pdfs
      format: "jpg",                // Auto convert to JPG (optional)
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "pdf"],
      transformation: [
        { width: 1080, crop: "limit" } // Resize only large images
      ]
    };
  },
});

// ------------------------------------
// 3. Initialize Multer
// ------------------------------------
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

module.exports = upload;
