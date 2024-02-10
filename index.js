const express = require("express");
const app = express();
const dotenv = require("dotenv");
const DbConnect = require("./database");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");
const cors = require("cors");

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use(express.json());

DbConnect();


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);

app.use(express.static(__dirname + './storage'));
app.use('/storage', express.static('storage'));

app.listen(5000);
