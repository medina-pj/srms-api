const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  mongodb_uri: process.env.MONGODB_URI
};
