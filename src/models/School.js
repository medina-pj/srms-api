const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    country: {
      type: String
    },
    city: {
      type: String
    },
    street: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    }
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: addressSchema
    },
    time_zone: {
      type: String,
      required: true
    },
    last_student_number: {
      type: Number,
      default: 1
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'schools',
    timestamps: true,
    minimize: false
  }
);

const School = mongoose.model('schools', schoolSchema);

module.exports = {
  School
};
