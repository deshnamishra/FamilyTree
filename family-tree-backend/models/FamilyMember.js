const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  treeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyTree',
    required: [true, 'Tree ID is required'],
    index: true,
  },
  linkedTreeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyTree',
    default: null,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  birthDate: {
    type: Date,
    validate: {
      validator: function (date) {
        return date <= new Date();
      },
      message: 'Birth date cannot be in the future'
    }
  },
  birthYear: {
    type: Number,
    min: 1000,
    max: 2100
  },
  deathYear: {
    type: Number,
    min: 1000,
    max: 2100,
    default: null
  },
  occupation: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null
  },
  photo: {
    type: String,
    trim: true,
    default: null
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
    default: null,
    validate: {
      validator: async function (partnerId) {
        if (!partnerId) return true;
        if (this && this._id && partnerId.equals(this._id)) return false; // Can't partner with self
        const partner = await mongoose.model('FamilyMember').findById(partnerId);
        if (!partner) return false;
        if (!partner.partner) return true;
        // During query-based updates, document context may not exist.
        if (!this || !this._id) return true;
        return partner.partner.equals(this._id);
      },
      message: 'Invalid partner relationship'
    }
  },
  parents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  }],
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FamilyMember",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
familyMemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Cascade delete middleware
familyMemberSchema.pre('remove', { document: true }, async function (next) {
  try {
    await mongoose.model('FamilyMember').updateMany(
      {
        $or: [
          { partner: this._id },
          { parents: this._id },
          { children: this._id }
        ]
      },
      {
        $pull: {
          partner: this._id,
          parents: this._id,
          children: this._id
        }
      }
    );
    next();
  } catch (err) {
    next(err);
  }
});

// Add text index for search functionality
familyMemberSchema.index({ name: 'text' });

module.exports = mongoose.model("FamilyMember", familyMemberSchema);