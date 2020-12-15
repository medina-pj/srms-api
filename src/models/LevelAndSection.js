const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    grade_level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'grade_levels',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'sections',
    timestamps: true,
    minimize: false
  }
);

const levelSchema = new mongoose.Schema(
  {
    education_stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'education_stages',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    sequence: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { collection: 'grade_levels', timestamps: true, minimize: false }
);

const GradeLevel = mongoose.model('grade_levels', levelSchema);
const Section = mongoose.model('sections', sectionSchema);

module.exports = {
  GradeLevel,
  Section
};
