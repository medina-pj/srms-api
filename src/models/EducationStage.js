const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isced: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'education_stages',
    timestamps: true,
    minimize: false,
  }
);

const EducationStage = mongoose.model('education_stages', schema);

module.exports = {
  EducationStage,
};
