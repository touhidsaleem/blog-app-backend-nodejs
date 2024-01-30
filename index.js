const express = require("express");
const app = express();
const dotenv = require("dotenv");
const DbConnect = require("./database");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");
const multer = require("multer");
const cors = require("cors");

dotenv.config();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081']
}))

app.use(express.json());

DbConnect();

const storage = multer.diskStorage({
  diskStorage: (req, file, cb) => {
    cb(null, images);
  },
  filename: (req, file, cb) => {
    cb(null, "hello.jpg");
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file Uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);

app.listen(5000);
// app.listen(process.env.PORT);
