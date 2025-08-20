const express=require("express")
const upload=require("../middleware/multer"); 
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

module.exports=router
