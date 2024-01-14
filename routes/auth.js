const router = require("express").Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(400).json("User is not registered");
    }

    if (req.body.password != user.password) {
      return res.status(400).json("Wrong credentials");
    }
    const { password, ...restData } = user?._doc;
    res.status(200).json(restData);
  } catch (error) {
    res.status(500).json(error || "Internal Server Error");
  }
});

module.exports = router;
