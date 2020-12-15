const { mongodb_uri } = require('../_config');
const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect(mongodb_uri, {
      useNewUrlParser: true,
      //DeprecationWarning: current URL string parser is deprecated.
      useUnifiedTopology: true,
      // DeprecationWarning: collection.ensureIndex is deprecated.
      useCreateIndex: true,
      //DeprecationWarning: current Server Discovery and Monitoring engine is deprecated.
      useFindAndModify: false
      //DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`
      //without the `useFindAndModify` option set to false are deprecated.
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
};
