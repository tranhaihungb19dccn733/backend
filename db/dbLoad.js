const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const models = require("../modelData/models");

const User = require("./userModel");
const Photo = require("./photoModel");
const SchemaInfo = require("./schemaInfo");

async function dbLoad() {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/photo_sharing";
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB for data loading");

  // Clear existing data
  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});

  // Load schema info
  const schemaInfo = models.schemaInfo();
  await SchemaInfo.create({
    __v: schemaInfo.__v,
    load_date_time: schemaInfo.load_date_time,
  });
  console.log("SchemaInfo loaded");

  // Load users - keep a map from old string _id to new ObjectId
  const userIdMap = {};
  const users = models.userListModel();
  for (const user of users) {
    const created = await User.create({
      _id: new mongoose.Types.ObjectId(user._id),
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
    userIdMap[user._id] = created._id;
  }
  console.log(`${users.length} users loaded`);

  // Load photos with comments
  const allPhotos = [];
  for (const user of users) {
    const userPhotos = models.photoOfUserModel(user._id);
    for (const photo of userPhotos) {
      const comments = (photo.comments || []).map((c) => ({
        _id: new mongoose.Types.ObjectId(c._id),
        comment: c.comment,
        date_time: c.date_time,
        user_id: userIdMap[c.user._id],
      }));
      allPhotos.push({
        _id: new mongoose.Types.ObjectId(photo._id),
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: userIdMap[photo.user_id],
        comments: comments,
      });
    }
  }
  for (const photo of allPhotos) {
    await Photo.create(photo);
  }
  console.log(`${allPhotos.length} photos loaded`);

  await mongoose.disconnect();
  console.log("Done. Database loaded successfully.");
}

dbLoad().catch((err) => {
  console.error("Error loading database:", err);
  process.exit(1);
});
