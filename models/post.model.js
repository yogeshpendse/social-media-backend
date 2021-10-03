const mongoose = require("mongoose");

const Postschema = new mongoose.Schema(
  {
    postid: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      min: [1, "minimum one character requires"],
    },
    likes: [],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Postdatalist", Postschema);

module.exports = { Post };
