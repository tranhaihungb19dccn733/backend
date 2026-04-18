const express = require("express");
const Post = require("../db/postModel");
const router = express.Router();

// GET /posts - list all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}, "title slug description author").lean();
    // Add id field for frontend
    const result = posts.map((p) => ({ id: p._id, ...p }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/:slug - get single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).lean();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts - create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description, content, author } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await Post.create({ title, slug, description, content, author });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
