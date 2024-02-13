const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Jimp = require('jimp');
const path = require('path');

// Get Trending Posts
router.get("/trending", async (req, res) => {
  try {
    const posts = await Post.find({ viewCount: { $gt: 10 } }); // Fetch posts where viewCount > 10
    res.status(200).json({ status: 200, success: true, data: posts, error: [], message: 'Trending Posts with viewCount greater than 10' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

// Create POST
router.post("/", async (req, res) => {
  let wordsPerMinute = 200
  const { desc, userName, title, photo, categories } = req.body
  const reqDescription = desc.split(' ')

  // Image Base64
  const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

  const imagePath = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}.png`;

  try {
    const JimpRes = await Jimp.read(buffer);
    JimpRes.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagePath}`))
  } catch (error) {
    res.status(500).json({ message: 'Internal Error' })
  }

  const newPost = new Post({
    desc, userName, title, photo: `/storage/${imagePath}`, categories, readTime: Math.ceil(reqDescription?.length / wordsPerMinute), viewCount: 0
  });

  console.log('savedPost', {
    desc, userName, title, photo: `/storage/${imagePath}`, categories, readTime: Math.ceil(reqDescription?.length / wordsPerMinute), viewCount: 0
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).send({ status: 200, success: true, data: savedPost, error: [], message: 'Created Post Successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
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
        res.status(200).json({ status: 200, success: true, data: updatedPost, error: [], message: 'Updated Post Successfully' });
      } catch (err) {
        res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
      }
    } else {
      res.status(401).json({ status: 401, success: false, data: {}, error: ["You can update only your post!"], message: '' });
    }
  } catch (err) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

// Delete POST
router.delete("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (post.userName === req.body.userName) {
      try {
        await post.deleteOne();
        res.status(200).json({ status: 200, success: true, data: {}, error: [], message: "Post Deleted Successfully!" });
      } catch (err) {
        res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
      }
    } else {
      res.status(401).json({ status: 401, success: false, data: {}, error: ['You can delete only your post!'], message: '' });
    }
  } catch (err) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

// GET POST BY ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 404, success: false, data: {}, error: ['Post not found'], message: '' });
    } else {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { viewCount: 1 } }, // Increment viewCount by 1
          { new: true }
        );
        res.status(200).json({ status: 200, success: true, data: updatedPost, error: [], message: 'Fetched Post Successfully' });
      } catch (err) {
        res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
      }
    }
  } catch (error) {
    res.status(404).json({ status: 404, success: false, data: {}, error: ['Post not found'], message: '' });
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
        categories: { $in: [catName] },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json({ status: 200, success: true, data: posts, error: [], message: 'Fetched Posts Successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

module.exports = router;
