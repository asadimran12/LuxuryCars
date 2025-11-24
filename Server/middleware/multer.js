const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Configure Cloudinary with your keys
// Ideally, put these in your .env file for security!
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dq4yrxcmn', 
  api_key: process.env.CLOUDINARY_API_KEY || '112427935511474',
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "luxury-cars", 
    allowed_formats: ["jpg", "png", "jpeg", "webp"], 
  },
});

// 3. Initialize Multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;