const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Create POST
router.post("/", async (req, res) => {
  let wordsPerMinute = 200
  const { desc, userName, title, photo, categories } = req.body
  const reqDescription = desc.split(' ')
  console.log('BODY', {
    desc, userName, title, photo, categories, readTime: Math.ceil(reqDescription?.length / wordsPerMinute)
  });
  const newPost = new Post({
    desc, userName, title, photo, categories, readTime: Math.ceil(reqDescription?.length / wordsPerMinute)
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userName === req.body.userName) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete POST
router.delete("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (post.userName === req.body.userName) {
      try {
        await post.deleteOne();
        res.status(200).json("Post Deleted Successfully!");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get  All Posts
router.get("/", async (req, res) => {
  const userName = req.query.user;
  const catName = req.query.cat;

  try {
    let posts;
    if (userName) {
      posts = await Post.find({ userName });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: { catName },
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
