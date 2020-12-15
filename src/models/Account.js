const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { jwtPrivateKey } = require('../_config');

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    assigned_school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'accounts',
    timestamps: true,
    minimize: false,
  }
);

schema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id, type: this.type }, jwtPrivateKey);
  return token;
};

const Account = mongoose.model('accounts', schema);

module.exports = {
  Account,
};
