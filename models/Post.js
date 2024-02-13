const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    readTime: {
      type: Number,
      required: true,
    },
    viewCount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
