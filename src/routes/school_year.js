const authAccount = require('../middlewares/auth');
const { SchoolYear } = require('../models');

module.exports = async function (app, opts) {
  app.get('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const school_years = await SchoolYear.find({ isDeleted: false });
      return res.code(200).send(school_years);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let school_year = new SchoolYear(req.body.payload);
      school_year = await school_year.save();

      return res.code(200).send('Successfully Saved');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const school_year = await SchoolYear.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!school_year) return res.code(404).send('School Year not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
