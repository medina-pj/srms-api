const authAccount = require('../middlewares/auth');
const { encryptData, compareEncryptedData } = require('../helpers/encryption');

const { Account } = require('../models');

module.exports = async function (app, opts) {
  app.get('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const account = await Account.findOne(
        { _id: req.user._id, isDeleted: false },
        { password: 0 }
      );
      if (!account) res.code(404).send('Account not found.');

      return res.code(200).send(account);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let account = new Account(req.body.payload);

      account.password = await encryptData(account.password);
      account = await account.save();

      const token = await account.generateAuthToken();
      return res.code(200).header('sjtis-auth-token', token).send('Successfully Saved');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/auth', async (req, res) => {
    try {
      const user = await Account.findOne({ username: req.body.payload.username });
      if (!user) return res.code(404).send('Invalid username/password.');

      const passwordMatch = await compareEncryptedData(req.body.payload.password, user.password);
      if (!passwordMatch) return res.code(404).send('Invalid username/password.');
      //Generate Auth Token
      const token = await user.generateAuthToken();
      return res.code(200).send({ token });
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
