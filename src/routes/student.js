const mongoose = require('mongoose');

const authAccount = require('../middlewares/auth');
const { Student } = require('../models/Student');

module.exports = async function (app, opts) {
  app.get('/search', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const students = await Student.aggregate([
        {
          $match: {
            last_name: { $regex: req.query.last_name ? req.query.last_name : '', $options: 'i' },
            isDeleted: false
          }
        },
        { $sort: { last_name: 1 } },
        {
          $lookup: {
            from: 'admissions',
            let: { student_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$student', '$$student_id']
                  }
                }
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 }
            ],
            as: 'admissions'
          }
        },
        { $unwind: '$admissions' },
        {
          $lookup: {
            from: 'school_years',
            let: { school_year_id: '$admissions.school_year' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$school_year_id']
                  }
                }
              }
            ],
            as: 'school_year'
          }
        },
        {
          $lookup: {
            from: 'education_stages',
            let: { education_stage_id: '$admissions.education_stage' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$education_stage_id']
                  }
                }
              }
            ],
            as: 'education_stage'
          }
        },
        {
          $lookup: {
            from: 'grade_levels',
            let: { grade_level_id: '$admissions.grade_level' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$grade_level_id']
                  }
                }
              }
            ],
            as: 'grade_level'
          }
        },
        {
          $lookup: {
            from: 'sections',
            let: { section_id: '$admissions.section' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$section_id']
                  }
                }
              }
            ],
            as: 'section'
          }
        },
        { $unwind: '$school_year' },
        { $unwind: '$education_stage' },
        { $unwind: '$grade_level' },
        { $unwind: '$section' },
        {
          $lookup: {
            from: 'student_finances',
            let: { student_id: '$_id' },
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
        },
        { $project: { admissions: 0 } }
      ]);

      return res.code(200).send(students);
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.get('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const lookup_admissions = {
        $lookup: {
          from: 'admissions',
          let: { student_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$student', '$$student_id']
                }
              }
            },
            {
              $lookup: {
                from: 'school_years',
                let: { school_year_id: '$school_year' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$school_year_id']
                      }
                    }
                  }
                ],
                as: 'school_year'
              }
            },
            {
              $lookup: {
                from: 'education_stages',
                let: { education_stage_id: '$education_stage' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$education_stage_id']
                      }
                    }
                  }
                ],
                as: 'education_stage'
              }
            },
            {
              $lookup: {
                from: 'grade_levels',
                let: { grade_level_id: '$grade_level' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$grade_level_id']
                      }
                    }
                  }
                ],
                as: 'grade_level'
              }
            },
            {
              $lookup: {
                from: 'sections',
                let: { section_id: '$section' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$section_id']
                      }
                    }
                  }
                ],
                as: 'section'
              }
            },
            { $unwind: '$school_year' },
            { $unwind: '$education_stage' },
            { $unwind: '$grade_level' },
            { $unwind: '$section' },
            { $sort: { createdAt: -1 } }
          ],
          as: 'admissions'
        }
      };

      const lookup_finances = {
        $lookup: {
          from: 'student_finances',
          let: { student_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$student', '$$student_id'] }, { $eq: ['$isDeleted', false] }]
                }
              }
            },
            { $sort: { createdAt: 1 } }
          ],
          as: 'finances'
        }
      };

      const students = await Student.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id)
          }
        },
        lookup_admissions,
        lookup_finances
      ]);

      if (students.length > 0) return res.code(200).send(students[0]);
      else return res.code(404).send("Student with the given id doesn't exist.");
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.post('/', { preHandler: [authAccount] }, async (req, res) => {
    try {
      let student = new Student(req.body.payload);
      student = await student.save();

      return res.code(200).send('Successfully Saved');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.put('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { ...req.body.payload },
        { runValidators: true, omitUndefined: true }
      );
      if (!student) return res.code(404).send('Student not found.');

      return res.code(200).send('Successfully updated.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });

  app.delete('/:id', { preHandler: [authAccount] }, async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { runValidators: true, omitUndefined: true }
      );
      if (!student) return res.code(404).send('Student not found.');

      return res.code(200).send('Successfully deleted.');
    } catch (error) {
      return res.code(500).send(error.message);
    }
  });
};
