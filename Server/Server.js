const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const app = express();
const path=require("path")
require("dotenv").config();
const router = require("./routers/auth_router");
const carrouter=require("./routers/car_router");
const uploadroutes=require("./routers/upload_multer");
const profile=require("./routers/user_router");
const querry=require("./routers/querry_router");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", router);
app.use("/api/car",carrouter)
app.use("/api", uploadroutes);
app.use("/api/user",profile)
app.use("/api/user/querry",querry)

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});
