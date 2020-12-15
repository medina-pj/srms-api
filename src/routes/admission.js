const mongoose = require('mongoose');
const Transaction = require('mongoose-transactions');

const authAccount = require('../middlewares/auth');

const { Admission, Student, StudentFinance } = require('../models/Admission');

module.exports = async function (app, opts) {
  app.get('/records', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const toObjectId = id => mongoose.Types.ObjectId(id);

      const lookupSchoolYear = [
        {
          $lookup: {
            from: 'school_years',
            localField: 'school_year',
            foreignField: '_id',
            as: 'school_year'
          }
        },
        { $unwind: '$school_year' }
      ];

      const lookupStage = [
        {
          $lookup: {
            from: 'education_stages',
            localField: 'education_stage',
            foreignField: '_id',
            as: 'education_stage'
          }
        },
        { $unwind: '$education_stage' }
      ];

      const lookupLevel = [
        {
          $lookup: {
            from: 'grade_levels',
            localField: 'grade_level',
            foreignField: '_id',
            as: 'grade_level'
          }
        },
        { $unwind: '$grade_level' }
      ];

      const lookupSection = [
        {
          $lookup: {
            from: 'sections',
            localField: 'section',
            foreignField: '_id',
            as: 'section'
          }
        },
        { $unwind: '$section' }
      ];

      const lookupStudent = [
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        {
          $match: {
            'student.last_name': {
              $regex: req.query.last_name ? req.query.last_name : '',
              $options: 'i'
            }
          }
        },
        {
          $sort: {
            'student.last_name': 1
          }
        }
      ];

      const lookupFinance = [
        {
          $lookup: {
            from: 'student_finances',
            let: { student_id: '$student._id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$student', '$$student_id'] }, { $eq: ['$isDeleted', false] }]
                  }
                }
              }
            ],
            as: 'finances'
          }
        }
      ];

      const { school_year, education_stage, grade_level, section } = req.query;
      const queries = {
        school_year: school_year && toObjectId(school_year),
        education_stage: education_stage && toObjectId(education_stage),
        grade_level: grade_level && toObjectId(grade_level),
        section: section && toObjectId(section)
      };

      Object.keys(queries).forEach(i => !queries[i] && delete queries[i]);

      const records = await Admission.aggregate([
        {
          $match: {
            school: toObjectId('5eabef82e9298a582bda7da5'),
            isDeleted: false,
            ...queries
          }
        },
        ...lookupSchoolYear,
        ...lookupStage,
        ...lookupLevel,
        ...lookupSection,
        ...lookupStudent,
        ...lookupFinance
      ]);

      return res.code(200).send(records);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.put('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        {
          school: req.body.foreign_keys.school_id,
          student: req.body.foreign_keys.student_id,
          education_stage: req.body.foreign_keys.education_stage_id,
          grade_level: req.body.foreign_keys.grade_level_id,
          section: req.body.foreign_keys.section_id,
          school_year: req.body.foreign_keys.school_year_id
        },
        { runValidators: true, omitUndefined: true }
      );
      if (!admission) return res.code(404).send('Admission not found.');

      return res.code(200).send('Successfully Updated');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!admission) return res.code(404).send('Admission not found.');

      return res.code(200).send('Successfully Deleted');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/new', { preHandler: [authAccount] }, async (req, res) => {
    const transaction = new Transaction();

    try {
      //1. GET LAST STUDENT NUMBER FROM SCHOOL DB
      //2. UPDATE SN FROM SCHOOL DB
      //3. CREATE STUDENT
      //4. CREATE ADMISSION
      //5. SAVE INVOICES AND PAYMENTS

      // //Create New Student
      // const student_id = transaction.insert(
      //   'students',
      //   new Student({
      //     school: req.body.foreign_keys.school_id,
      //     ...req.body.payload.student
      //   })
      // );

      // // Create New Admission
      // const admission_id = transaction.insert(
      //   'admissions',
      //   new Admission({
      //     student: student_id,
      //     school: req.body.foreign_keys.school_id,
      //     education_stage: req.body.foreign_keys.education_stage_id,
      //     grade_level: req.body.foreign_keys.grade_level_id,
      //     section: req.body.foreign_keys.section_id,
      //     school_year: req.body.foreign_keys.school_year_id
      //   })
      // );

      // const { invoice, payment } = req.body.payload;

      // //Save Invoices
      // invoice.map(data => {
      //   transaction.insert(
      //     'student_finances',
      //     new StudentFinance({
      //       student: student_id,
      //       admission: admission_id,
      //       description: data.description,
      //       amount: data.amount,
      //       type: 'invoice'
      //     })
      //   );
      // });

      // //Save Payments
      // payment.map(data => {
      //   transaction.insert(
      //     'student_finances',
      //     new StudentFinance({
      //       student: student_id,
      //       admission: admission_id,
      //       description: data.description,
      //       amount: data.amount,
      //       type: 'payment'
      //     })
      //   );
      // });

      // await transaction.run();

      return res.code(200).send('Admission Successfully Saved.');
    } catch (error) {
      console.log(error);
      await transaction.rollback().catch(console.error);
      await transaction.clean();
      return res.code(500).send('Something Went Wrong.');
    }
  });

  app.post('/old', { preHandler: [authAccount] }, async (req, res) => {
    const transaction = new Transaction();

    try {
      // // Create New Admission
      // const admission_id = transaction.insert(
      //   'admissions',
      //   new Admission({
      //     student: req.body.foreign_keys.student_id,
      //     school: req.body.foreign_keys.school_id,
      //     education_stage: req.body.foreign_keys.education_stage_id,
      //     grade_level: req.body.foreign_keys.grade_level_id,
      //     section: req.body.foreign_keys.section_id,
      //     school_year: req.body.foreign_keys.school_year_id
      //   })
      // );

      // const { invoice, payment } = req.body.payload;

      // //Save Invoices
      // invoice.map(data => {
      //   transaction.insert(
      //     'student_finances',
      //     new StudentFinance({
      //       student: req.body.foreign_keys.student_id,
      //       admission: admission_id,
      //       description: data.description,
      //       amount: data.amount,
      //       type: 'invoice'
      //     })
      //   );
      // });

      // //Save Payments
      // payment.map(data => {
      //   transaction.insert(
      //     'student_finances',
      //     new StudentFinance({
      //       student: req.body.foreign_keys.student_id,
      //       admission: admission_id,
      //       description: data.description,
      //       amount: data.amount,
      //       type: 'payment'
      //     })
      //   );
      // });

      // await transaction.run();

      return res.code(200).send('Admission Successfully Saved.');
    } catch (error) {
      await transaction.rollback().catch(console.error);
      await transaction.clean();
      return res.code(500).send('Something Went Wrong.');
    }
  });
};
