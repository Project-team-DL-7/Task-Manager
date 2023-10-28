const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const UserController = require('./src/api/controllers/UserController');

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
    },
  },
  apis: ['src/api/controllers/*.js'],  // Update this to the path where your controllers are
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const PORT = 5000;

// Use Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/user', UserController);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
