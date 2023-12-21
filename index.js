const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");
const cors = require("cors");

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

module.exports.db = db;

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

app.use(cors()); // Enable CORS for all routes

// for auth views
app.set("views", "./src/views");
app.set("view engine", "ejs");

// use JSONs
app.use(express.json());

// Use Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Session support for passport.js
var session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);
var passport = require("passport");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./" }),
  })
);
app.use(passport.authenticate("session"));

const UserController = require("./src/api/controllers/UserController");
const TeamController = require("./src/api/controllers/TeamController");
const TaskController = require("./src/api/controllers/TaskController");
const ProjectController = require("./src/api/controllers/ProjectController");
const AuthController = require("./src/api/controllers/AuthController");

app.use("/user", UserController);
app.use("/team", TeamController);
app.use("/task", TaskController);
app.use("/project", ProjectController);
app.use("/", AuthController);

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

module.exports.app = app;
