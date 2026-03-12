// routes/treeroutes.js
const express = require("express");
const router = express.Router();
const FamilyTree = require("../models/familyTree");

// GET all trees - /api/trees
router.get("/", async (req, res) => {
  try {
    const trees = await FamilyTree.find().sort({ createdAt: -1 });
    res.json(trees);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch trees",
      error: err.message 
    });
  }
});

// GET single tree - /api/trees/:id
router.get("/:id", async (req, res) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);
    if (!tree) return res.status(404).json({ message: "Tree not found" });
    res.json(tree);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch tree",
      error: err.message 
    });
  }
});

// POST create tree - /api/trees
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Tree name is required" });
    }
    const newTree = await FamilyTree.create({ name, description });
    res.status(201).json(newTree);
  } catch (err) {
    res.status(400).json({ 
      message: "Failed to create tree",
      error: err.message 
    });
  }
});

// PUT update tree - /api/trees/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedTree = await FamilyTree.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTree) {
      return res.status(404).json({ message: "Tree not found" });
    }
    res.json(updatedTree);
  } catch (err) {
    res.status(400).json({ 
      message: "Failed to update tree",
      error: err.message 
    });
  }
});

// DELETE tree - /api/trees/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedTree = await FamilyTree.findByIdAndDelete(req.params.id);
    if (!deletedTree) {
      return res.status(404).json({ message: "Tree not found" });
    }
    res.json({ message: "Tree deleted successfully" });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to delete tree",
      error: err.message 
    });
  }
});

module.exports = router;