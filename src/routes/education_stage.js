const authAccount = require('../middlewares/auth');
const { EducationStage } = require('../models');

module.exports = async function (app, opts) {
  app.get('/:school', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const stages = await EducationStage.find({
        school: req.params.school,
        isDeleted: false
      }).sort({ isced: 'asc' });

      return res.code(200).send(stages);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let stage = new EducationStage(req.body.payload);
      stage = await stage.save();

      return res.code(200).send('Successfully saved.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const stage = await EducationStage.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!stage) return res.code(404).send('Stage not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
