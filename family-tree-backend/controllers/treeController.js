// controllers/treeController.js
const FamilyTree = require('../models/familyTree');

exports.getFamilyTrees = async (req, res) => {
  try {
    const trees = await FamilyTree.find();
    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFamilyTree = async (req, res) => {
  try {
    const newTree = new FamilyTree(req.body);
    const savedTree = await newTree.save();
    res.status(201).json(savedTree);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};