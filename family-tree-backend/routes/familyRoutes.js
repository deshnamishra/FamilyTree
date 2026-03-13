const express = require("express");
const router = express.Router();
const FamilyMember = require("../models/FamilyMember");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middlewares
router.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be loaded from other origins if needed
}));

router.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Custom sanitization middleware
router.use((req, _, next) => {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].replace(/\$/g, '').replace(/\./g, '');
      }
    });
  }
  next();
});

// Validation functions
const isValidObjectId = (id) => {
  try {
    return new ObjectId(id).toString() === id;
  } catch (err) {
    return false;
  }
};

const validateMember = (member) => {
  const errors = [];

  // Validate name
  if (!member.name || typeof member.name !== 'string' || member.name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  } else if (member.name.length > 100) {
    errors.push("Name must be 100 characters or less");
  }

  // Validate gender
  if (!['male', 'female', 'other'].includes(member.gender)) {
    errors.push("Gender must be 'male', 'female', or 'other'");
  }

  // Validate partner ID if provided
  if (member.partner && !isValidObjectId(member.partner)) {
    errors.push("Invalid partner ID format");
  }

  // Handle parsing of array strings (FormData sends arrays as comma-separated strings or multiple fields)
  const parseArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return val.split(',').map(s => s.trim()).filter(Boolean); }
    }
    return [];
  };

  const parents = parseArray(member.parents);
  if (parents.length > 2) {
    errors.push("A member can have at most 2 parents");
  } else {
    parents.forEach(id => {
      if (!isValidObjectId(id)) errors.push(`Invalid parent ID format: ${id}`);
    });
  }

  const children = parseArray(member.children);
  children.forEach(id => {
    if (!isValidObjectId(id)) errors.push(`Invalid child ID format: ${id}`);
  });


  // Validate treeId
  if (!member.treeId || !isValidObjectId(member.treeId)) {
    errors.push("Valid Tree ID is required");
  }

  return errors;
};

// GET all family members (optionally filter by treeId)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 200, 1), 500);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.treeId) filter.treeId = req.query.treeId;

    const [members, count] = await Promise.all([
      FamilyMember.find(filter)
        .populate([
          { path: 'partner', select: 'name gender' },
          { path: 'parents', select: 'name gender' },
          { path: 'children', select: 'name gender' }
        ])
        .skip(skip)
        .limit(limit)
        .lean(),
      FamilyMember.countDocuments(filter)
    ]);

    res.json({
      data: members,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch family data",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Helper to sanitize incoming body from FormData
const parseFormDataArrays = (body) => {
  const parsed = { ...body };
  if (typeof parsed.parents === 'string') {
    try { parsed.parents = JSON.parse(parsed.parents); } catch (e) { parsed.parents = parsed.parents.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof parsed.children === 'string') {
    try { parsed.children = JSON.parse(parsed.children); } catch (e) { parsed.children = parsed.children.split(',').map(s => s.trim()).filter(Boolean); }
  }
  // Prevent empty strings from becoming invalid ObjectIds
  if (parsed.partner === '' || parsed.partner === 'null') parsed.partner = null;
  return parsed;
};

// POST new family member
router.post("/", upload.single('photoFile'), async (req, res) => {
  try {
    console.log('[POST /api/family] Request body:', req.body);
    if (req.file) {
      console.log('[POST /api/family] Received file:', req.file.filename);
      req.body.photo = `/uploads/${req.file.filename}`;
    }

    const parsedBody = parseFormDataArrays(req.body);

    // Validate input
    const validationErrors = validateMember(parsedBody);
    if (validationErrors.length > 0) {
      console.warn('[POST /api/family] Validation errors:', validationErrors);
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors
      });
    }

    // Check if parents exist
    if (parsedBody.parents?.length > 0) {
      const parentsExist = await FamilyMember.countDocuments({
        _id: { $in: parsedBody.parents }
      });
      if (parentsExist !== parsedBody.parents.length) {
        return res.status(400).json({ error: "One or more parents not found" });
      }
    }

    // Check if children exist
    if (parsedBody.children?.length > 0) {
      const childrenExist = await FamilyMember.countDocuments({
        _id: { $in: parsedBody.children }
      });
      if (childrenExist !== parsedBody.children.length) {
        return res.status(400).json({ error: "One or more children not found" });
      }
    }

    // Check if partner exists
    if (parsedBody.partner) {
      const partnerExists = await FamilyMember.exists({ _id: parsedBody.partner });
      if (!partnerExists) {
        return res.status(400).json({ error: "Partner not found" });
      }
    }

    // Create member
    const newMember = await FamilyMember.create(parsedBody);
    console.log('[POST /api/family] Created member:', newMember._id);

    // --- Wire Reciprocal Relationships ---
    const relationshipUpdates = [];

    // 1. If parents provided, add this member to those parents' children array
    if (parsedBody.parents?.length > 0) {
      relationshipUpdates.push(
        FamilyMember.updateMany(
          { _id: { $in: parsedBody.parents } },
          { $addToSet: { children: newMember._id } }
        )
      );
    }

    // 2. If children provided, add this member to those children's parents array
    if (parsedBody.children?.length > 0) {
      relationshipUpdates.push(
        FamilyMember.updateMany(
          { _id: { $in: parsedBody.children } },
          { $addToSet: { parents: newMember._id } }
        )
      );
    }

    // 3. If partner provided, set this member as that partner's partner
    if (parsedBody.partner) {
      relationshipUpdates.push(
        FamilyMember.findByIdAndUpdate(parsedBody.partner, { partner: newMember._id })
      );
    }

    await Promise.all(relationshipUpdates);
    console.log('[POST /api/family] Reciprocal relationships updated');

    res.status(201).json(newMember);
  } catch (err) {
    console.error('[POST /api/family] Error:', err);
    res.status(400).json({
      error: "Failed to create member",
      details: err.errors ? Object.values(err.errors).map(e => e.message) : err.message
    });
  }
});

// GET family tree
router.get("/:memberId/tree", async (req, res) => {
  try {
    const rootMember = await FamilyMember.findById(req.params.memberId);
    if (!rootMember) return res.status(404).json({ error: "Member not found" });

    const maxDepth = Math.min(Math.max(parseInt(req.query.depth) || 3, 1), 5);
    const memberCache = new Map();

    const buildTree = async (memberId, depth) => {
      if (depth <= 0) return null;
      if (memberCache.has(memberId)) return memberCache.get(memberId);

      const member = await FamilyMember.findById(memberId)
        .select('name gender partner parents children')
        .lean();

      if (!member) return null;

      const tree = {
        _id: member._id,
        name: member.name,
        gender: member.gender,
        partner: null,
        parents: [],
        children: []
      };

      memberCache.set(memberId, tree);

      // Process relationships
      const [partner, parents, children] = await Promise.all([
        member.partner ? FamilyMember.findById(member.partner) : null,
        FamilyMember.find({ _id: { $in: member.parents } }),
        FamilyMember.find({ _id: { $in: member.children } })
      ]);

      if (partner) {
        tree.partner = {
          _id: partner._id,
          name: partner.name,
          gender: partner.gender
        };
      }

      tree.parents = parents.map(p => ({
        _id: p._id,
        name: p.name,
        gender: p.gender
      }));

      tree.children = children.map(c => ({
        _id: c._id,
        name: c.name,
        gender: c.gender
      }));

      // Recursively build deeper levels
      if (depth > 1) {
        await Promise.all([
          ...(tree.partner ? [buildTree(tree.partner._id, depth - 1)] : []),
          ...tree.parents.map((parent, i) =>
            buildTree(parent._id, depth - 1).then(parentTree => {
              tree.parents[i] = parentTree;
            })
          ),
          ...tree.children.map((child, i) =>
            buildTree(child._id, depth - 1).then(childTree => {
              tree.children[i] = childTree;
            })
          )
        ]);
      }

      return tree;
    };

    const familyTree = await buildTree(req.params.memberId, maxDepth);
    res.json(familyTree);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to build family tree",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PUT update a family member
router.put("/:id", upload.single('photoFile'), async (req, res) => {
  try {
    const memberId = req.params.id;
    if (!isValidObjectId(memberId)) {
      return res.status(400).json({ error: "Invalid member ID format" });
    }

    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`;
    }

    const parsedBody = parseFormDataArrays(req.body);

    // 1. Get current state to compare changes
    const oldMember = await FamilyMember.findById(memberId);
    if (!oldMember) return res.status(404).json({ error: "Member not found" });

    // 2. Validate new data
    const validationErrors = validateMember({ ...oldMember.toObject(), ...parsedBody });
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    // 3. Update the member
    const updatedMember = await FamilyMember.findByIdAndUpdate(
      memberId,
      parsedBody,
      { new: true, runValidators: true }
    );

    // 4. Handle Relationship Changes (Clearing old, setting new)
    const updates = [];

    // --- Partners ---
    const oldPartner = oldMember.partner?.toString();
    const newPartner = parsedBody.partner;
    if (oldPartner !== newPartner) {
      if (oldPartner) {
        updates.push(FamilyMember.findByIdAndUpdate(oldPartner, { $unset: { partner: "" } }));
      }
      if (newPartner) {
        updates.push(FamilyMember.findByIdAndUpdate(newPartner, { partner: memberId }));
      }
    }

    // --- Parents ---
    const oldParents = (oldMember.parents || []).map(p => p.toString());
    const newParents = parsedBody.parents || [];
    // Remove from old parents who are NOT in new parents
    const parentsToRemove = oldParents.filter(p => !newParents.includes(p));
    if (parentsToRemove.length > 0) {
      updates.push(FamilyMember.updateMany({ _id: { $in: parentsToRemove } }, { $pull: { children: memberId } }));
    }
    // Add to new parents who were NOT in old parents
    const parentsToAdd = newParents.filter(p => !oldParents.includes(p));
    if (parentsToAdd.length > 0) {
      updates.push(FamilyMember.updateMany({ _id: { $in: parentsToAdd } }, { $addToSet: { children: memberId } }));
    }

    // --- Children ---
    const oldChildren = (oldMember.children || []).map(c => c.toString());
    const newChildren = parsedBody.children || [];
    // Remove from old children who are NOT in new children
    const childrenToRemove = oldChildren.filter(c => !newChildren.includes(c));
    if (childrenToRemove.length > 0) {
      updates.push(FamilyMember.updateMany({ _id: { $in: childrenToRemove } }, { $pull: { parents: memberId } }));
    }
    // Add to new children who were NOT in old children
    const childrenToAdd = newChildren.filter(c => !oldChildren.includes(c));
    if (childrenToAdd.length > 0) {
      updates.push(FamilyMember.updateMany({ _id: { $in: childrenToAdd } }, { $addToSet: { parents: memberId } }));
    }

    await Promise.all(updates);

    const populated = await FamilyMember.findById(memberId).populate([
      { path: 'partner', select: 'name gender' },
      { path: 'parents', select: 'name gender' },
      { path: 'children', select: 'name gender' }
    ]);

    res.json(populated);
  } catch (err) {
    console.error('[PUT /api/family] Error:', err);
    res.status(400).json({ error: "Update failed", details: err.message });
  }
});

// DELETE a family member
router.delete("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid member ID format" });
    }
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    // Remove references from other members
    await FamilyMember.updateMany(
      {
        $or: [
          { partner: member._id },
          { parents: member._id },
          { children: member._id }
        ]
      },
      { $pull: { parents: member._id, children: member._id }, $unset: { partner: "" } }
    );

    await FamilyMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
// GET all trees (or all top-level members to display as available trees)
router.get("/trees", async (req, res) => {
  try {
    const trees = await FamilyMember.find({})
      .select('_id name gender')
      .lean();

    res.status(200).json({ data: trees });
  } catch (err) {
    console.error("Error fetching trees:", err);
    res.status(500).json({ error: "Failed to fetch family trees" });
  }
});


module.exports = router;