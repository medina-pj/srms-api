const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'students',
      required: true
    },
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admissions',
      default: null
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['invoice', 'payment'],
      default: 'invoice'
    },
    amount: {
      type: Number,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'student_finances',
    timestamps: true,
    minimize: false
  }
);

const StudentFinance = mongoose.model('student_finances', financeSchema);

module.exports = {
  StudentFinance
};
