const mongoose = require('mongoose');

const FamilyTreeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'familytrees' } // Optional: customize collection name
);

module.exports = mongoose.model('FamilyTree', FamilyTreeSchema);
