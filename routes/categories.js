const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
  console.log(req.body);
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json({ status: 200, success: true, data: savedCat, error: [], message: 'Category added Successfully' });
  } catch (error) {
    res.status(403).json({ status: 403, success: false, data: { categoryName: req.body.name }, error: ["Category already Exist"], message: '' });
  }
});

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ status: 200, success: true, data: category, error: [], message: 'Categories Fetched Successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, success: false, data: {}, error: ['Internal Server Error'], message: '' });
  }
});

module.exports = router;
