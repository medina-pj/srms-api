const authAccount = require('../middlewares/auth');
const { Section } = require('../models');

module.exports = async function (app, opts) {
  app.get('/:grade_level', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const sections = await Section.find({
        grade_level: req.params.grade_level,
        isDeleted: false
      }).sort({ sequence: 'asc' });

      return res.code(200).send(sections);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let section = new Section(req.body.payload);
      section = await section.save();

      return res.code(200).send('Successfully saved.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const section = await Section.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!section) return res.code(404).send('Section not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
