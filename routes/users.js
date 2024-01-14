const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Update
router.put("/:id", async (req, res) => {
  try {
    await User.findById(req.params.id);
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(401).json("Unauthorized");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  //   if (req.body.userId === req.params.id) {
  try {
    const user = await User.findById(req.params.id);
    try {
      await Post.deleteMany({ userName: user.userName });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(404).json("User Not Found!");
  }
  //   } else {
  //     res.status(401).json("Unauthorized");
  //   }
});

// GET User By Id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...restData } = user._doc;
    res.status(200).json(restData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
