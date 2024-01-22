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
    res.status(200).json({ status: 200, success: true, data: user, error: [], message: 'Registered Succesfully' });
  } catch (error) {
    res.status(400).json({ status: 400, success: false, data: {}, error: ["User Already exist"], message: '' });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    let user

    if (req.body.userName.includes('@')) {
      user = await User.findOne({ email: req.body.userName });
    } else {
      user = await User.findOne({ userName: req.body.userName });
    }

    if (!user) {
      return res.status(404).json({ status: 400, success: false, data: {}, error: ["User is not registered"], message: '' });
    }

    if (req.body.password != user.password) {
      return res.status(400).json({ status: 400, success: false, data: {}, error: ["Wrong credentials"], message: '' });
    }
    const { password, ...restData } = user?._doc;
    res.status(200).json({ status: 200, success: true, data: restData, error: [], message: 'LoggedIn Successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ["Internal Server Error"], message: '' });
  }
});

module.exports = router;
