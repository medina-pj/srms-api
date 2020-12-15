const bcrypt = require('bcrypt');

async function encryptData(data) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(data, salt);
  return hashed;
}

async function compareEncryptedData(data, encryptedData) {
  const result = await bcrypt.compare(data, encryptedData);
  return result;
}

module.exports = {
  encryptData: encryptData,
  compareEncryptedData: compareEncryptedData
}

