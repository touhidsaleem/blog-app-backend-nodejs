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
      res.status(200).json({ status: 200, success: true, data: updatedUser, error: [], message: 'Updated User Successfully' });
    } catch (error) {
      res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
    }
  } catch (error) {
    res.status(401).json({ status: 401, success: false, data: {}, error: ["Unauthorized User"], message: '' });
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
      res.status(200).json({ status: 200, success: true, data: {}, error: [], message: "User Deleted Successfully!" });
    } catch (error) {
      res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
    }
  } catch (error) {
    res.status(404).json({ status: 404, success: false, data: {}, error: ["User Not Found!"], message: '' });
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
    res.status(200).json({ status: 200, success: true, data: restData, error: [], message: 'Successfully fetched UserData' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

module.exports = router;
