const mongoose = require('mongoose');

const authAccount = require('../middlewares/auth');
const { School, StudentFinance } = require('../models');

module.exports = async function (app, opts) {
  app.get('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const school = await School.findOne({ _id: req.params.id, isDeleted: false });
      if (!school) return res.code(404).send('School not found.');

      return res.code(200).send(school);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let school = new School(req.body.payload);
      school = await school.save();

      return res.code(200).send('Successfully Saved');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.get('/financial_record', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const filterByType = req.query.type === 'all' ? null : req.query.type;

      const finances = await StudentFinance.aggregate([
        //Lookup Student model
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },

        //Filter from specified school
        {
          $match: {
            'student.school': mongoose.Types.ObjectId(req.query.school)
          }
        },

        //Format createdAt
        {
          $addFields: {
            date_recorded: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          }
        },

        //Filter start date, end date, isDeleted, type
        {
          $match: {
            $expr: {
              $and: [
                { $gte: ['$date_recorded', req.query.start_date] },
                { $lte: ['$date_recorded', req.query.end_date] },
                { $eq: ['$isDeleted', false] },
                { $eq: [filterByType ? '$type' : null, filterByType] }
              ]
            }
          }
        },

        { $sort: { createdAt: 1 } }
      ]);

      return res.code(200).send(finances);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
