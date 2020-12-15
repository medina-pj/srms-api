module.exports = function(app) {
  
  app.register(require('fastify-cors'), { 
    'origin':true,
    'methods':['GET', 'PUT', 'POST', 'DELETE'],
    'allowedHeaders':['Content-Type', 'sjtis-auth-token'],
    'exposedHeaders':['sjtis-auth-token'],
  });
  
  app.register(require('fastify-multipart'), {
    addToBody: true,
  });

}