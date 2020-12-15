const app = require('fastify')();

//Database Connection
require('./startup/db')();

// //Middleware
require('./startup/middleware')(app);

// //ROUTES
require('./routes')(app);

// Run The Server
app
  .listen(process.env.PORT || 3000, '0.0.0.0')
  .then(res => {
    console.log(`Server running at ${res}/`);
  })
  .catch(err => {
    console.log(`Something went wrong ${err}/`);
  });
