const mongoose = require("mongoose");

async function dbConnect() {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/photo_sharing";
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB:", mongoURI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = dbConnect;
