const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const PostRouter = require("./routes/PostRouter");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
dbConnect();

// Routes
app.use("/user", UserRouter);
app.use("/photosOfUser", PhotoRouter);
app.use("/posts", PostRouter);

// POST /login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded login for demo
  if (username === "admin" && password === "admin") {
    return res.json({ success: true, user: { username: "admin", name: "Admin" } });
  }
  res.json({ success: false, message: "Invalid username or password" });
});

// GET /test/info
const SchemaInfo = require("./db/schemaInfo");
app.get("/test/info", async (req, res) => {
  try {
    const info = await SchemaInfo.findOne({});
    if (!info) {
      return res.status(404).json({ error: "SchemaInfo not found" });
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
