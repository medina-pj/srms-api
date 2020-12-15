const authAccount = require('../middlewares/auth');
const { GradeLevel } = require('../models');

module.exports = async function (app, opts) {
  app.get('/:education_stage', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const levels = await GradeLevel.find({
        education_stage: req.params.education_stage,
        isDeleted: false
      }).sort({ sequence: 'asc' });

      return res.code(200).send(levels);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let level = new GradeLevel(req.body.payload);
      level = await level.save();

      return res.code(200).send('Successfully saved');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const level = await GradeLevel.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!level) return res.code(404).send('Stage not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
