const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
  },
  { _id: false }
);

const guardianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    occupation: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
      required: true,
    },
    student_number: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
    },
    last_name: {
      type: String,
      required: true,
    },
    suffix: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    date_of_birth: {
      type: String,
    },
    place_of_birth: {
      type: String,
    },
    additional_info: {
      type: String,
    },
    address: {
      type: addressSchema,
    },
    guardian: {
      type: guardianSchema,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'students',
    timestamps: true,
    minimize: false,
  }
);

const Student = mongoose.model('students', studentSchema);

module.exports = {
  Student,
};
