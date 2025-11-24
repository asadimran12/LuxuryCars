const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config(); // Load environment variables

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "luxury-cars", // The folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allowed file types
    // Optional: Resize images to max 1080px width to save bandwidth
    transformation: [{ width: 1080, crop: "limit" }], 
  },
});

// 3. Initialize Multer
const upload = multer({ storage });

module.exports = upload;