const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

// GET /photosOfUser/:id
// Returns photos with _id, user_id, comments, file_name, date_time
// Each comment has: comment, date_time, _id, user {_id, first_name, last_name}
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // Verify user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const photos = await Photo.find(
      { user_id: req.params.id },
      "_id user_id comments file_name date_time"
    );

    // Build response: populate comment user info with only _id, first_name, last_name
    const result = await Promise.all(
      photos.map(async (photo) => {
        const photoObj = {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: await Promise.all(
            (photo.comments || []).map(async (c) => {
              const commentUser = await User.findById(
                c.user_id,
                "_id first_name last_name"
              );
              return {
                comment: c.comment,
                date_time: c.date_time,
                _id: c._id,
                user: commentUser,
              };
            })
          ),
        };
        return photoObj;
      })
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
