const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

const UserController = require('./src/api/controllers/UserController');
const TeamController = require('./src/api/controllers/TeamController');
const TaskController = require('./src/api/controllers/TaskController');
const ProjectController = require('./src/api/controllers/ProjectController');

app.use('/user', UserController);
app.use('/team', TeamController);
app.use('/task', TaskController);
app.use('/project', ProjectController);

app.listen(PORT, () => {
  console.log(`Server documentation running on http://localhost:${PORT}/api-docs/`);
});
