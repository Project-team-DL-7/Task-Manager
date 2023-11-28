const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

// load variables from .env
require("dotenv").config();

const dbConnectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// for migrations
const migrationClient = postgres(dbConnectionString, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "./migrations" });

// for query purposes
const schema = require("./src/infrastructure/storage/schema");
const queryClient = postgres(dbConnectionString);
const db = drizzle(queryClient, {
  schema: schema,
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Task Manager API",
      version: "1.0.0",
    },
  },
  apis: ["src/api/controllers/*.js"], // Update this to the path where your controllers are
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const PORT = process.env.PORT;

// use JSONs
app.use(express.json());

// Use Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const UserController = require("./src/api/controllers/UserController");
const TeamController = require("./src/api/controllers/TeamController");
const TaskController = require("./src/api/controllers/TaskController");
const ProjectController = require("./src/api/controllers/ProjectController");

app.use("/user", UserController);
app.use("/team", TeamController);
app.use("/task", TaskController);
app.use("/project", ProjectController);

// Only print errors to log
function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(500);
  res.send("Internal Server Error");
}
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(
    `Server documentation running on http://localhost:${PORT}/api-docs/`
  );
});

module.exports = db;
