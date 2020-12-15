module.exports = function (app) {
  app.register(require('./account'), { prefix: `/api/account` });
  app.register(require('./school'), { prefix: `/api/school` });
  app.register(require('./education_stage'), { prefix: `/api/education_stage` });
  app.register(require('./grade_level'), { prefix: `/api/grade_level` });
  app.register(require('./section'), { prefix: `/api/section` });
  app.register(require('./student'), { prefix: `/api/student` });
  app.register(require('./student_finance'), { prefix: `/api/student/finance` });
  app.register(require('./school_year'), { prefix: `/api/school_year` });
  app.register(require('./admission'), { prefix: `/api/admission` });
};
