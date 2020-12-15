const jwt = require('jsonwebtoken');
const { jwtPrivateKey } = require('../_config');
const { Account } = require('../models');

module.exports = async function authAccount(req, res) {
  //Check If Token Is Sent
  const token = req.headers['sjtis-auth-token'];
  if (!token)
    return res.status(401).send({
      message: 'Access denied. No token provided.'
    });
  //Validate Token
  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    const account = await Account.findById(req.user._id);
    if (!account) return res.status(400).send({ message: 'Invalid Id Token.' });
  } catch (ex) {
    res.status(400).send({ message: 'Invalid Token.' });
  }
};
