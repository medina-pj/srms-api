const mongoose = require('mongoose');

const schoolyearSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
      required: true,
    },
    start_year: {
      type: String,
      required: true,
    },
    end_year: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'school_years',
    timestamps: true,
    minimize: false,
  }
);

const admissionSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students',
      required: true,
    },
    education_stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'education_stages',
      required: true,
    },
    grade_level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'grade_levels',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sections',
      required: true,
    },
    school_year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'school_years',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'admissions',
    timestamps: true,
    minimize: false,
  }
);

const Admission = mongoose.model('admissions', admissionSchema);
const SchoolYear = mongoose.model('school_years', schoolyearSchema);

module.exports = {
  Admission,
  SchoolYear,
};
