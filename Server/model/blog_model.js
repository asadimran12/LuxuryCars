import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: String,
      default: "Admin",
    },
    image: {
      type: String,
      default: "", 
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Blog", blogSchema);
