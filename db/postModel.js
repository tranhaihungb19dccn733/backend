const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  content: { type: String, default: "" },
  author: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
