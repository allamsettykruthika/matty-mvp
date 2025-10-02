const express = require("express");
const jwt = require("jsonwebtoken");
const Design = require("../models/Design");

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Save design
router.post("/", auth, async (req, res) => {
  const { title, jsonData, thumbnailUrl } = req.body;
  const design = await Design.create({ userId: req.user.id, title, jsonData, thumbnailUrl });
  res.json(design);
});

// Get all designs
router.get("/", auth, async (req, res) => {
  const designs = await Design.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(designs);
});

// ✅ Delete a design by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!design) return res.status(404).json({ msg: "Design not found" });
    res.json({ msg: "Design deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
