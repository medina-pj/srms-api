const mongoose = require('mongoose');

const authAccount = require('../middlewares/auth');
const { StudentFinance } = require('../models');

module.exports = async function (app, opts) {
  app.get('/:student', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const finances = await StudentFinance.find({
        student: mongoose.Types.ObjectId(req.params.student)
      });

      return res.code(200).send(finances);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let finance = new StudentFinance(req.body.payload);
      finance = await finance.save();

      return res.code(200).send('Successfully saved.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const section = await StudentFinance.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!section) return res.code(404).send('Student Finance not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
