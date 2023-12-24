const { relations } = require("drizzle-orm");
const {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  uniqueIndex,
  primaryKey,
  unique,
} = require("drizzle-orm/pg-core");

const teams = pgTable(
  "teams",
  {
    id_team: serial("id").primaryKey(),
    team_name: text("name").notNull(),
    description: text("description"),
  },
  (teams) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(teams.team_name),
    };
  }
);

const teamsRelations = relations(teams, ({ many }) => ({
  usersToTeams: many(usersToTeams),
  teamsToProjects: many(teamsToProjects),
  tasksToTeams: many(tasksToTeams),
}));

const users = pgTable("users", {
  id_user: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  registrationDate: timestamp("registeredAt").defaultNow().notNull(),
});

const usersRelations = relations(users, ({ many }) => ({
  usersToTeams: many(usersToTeams),
  tasksToUsers: many(tasksToUsers),
}));

const usersToTeams = pgTable(
  "users_to_teams",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id_user),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id_team),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.teamId),
  })
);

const usersToTeamsRelations = relations(usersToTeams, ({ one }) => ({
  team: one(teams, {
    fields: [usersToTeams.teamId],
    references: [teams.id_team],
  }),
  user: one(users, {
    fields: [usersToTeams.userId],
    references: [users.id_user],
  }),
}));

const projects = pgTable("projects", {
  id_project: serial("id").primaryKey(),
  description: text("description"),
});

const projectsRelations = relations(projects, ({ one, many }) => ({
  teamsToProjects: many(teamsToProjects),
  tasks: many(tasks),
}));

const teamsToProjects = pgTable(
  "teams_to_projects",
  {
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id_team),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id_project),
  },
  (t) => ({
    pk: primaryKey(t.teamId, t.projectId),
  })
);

const tasks = pgTable("tasks", {
  id_task: serial("id").primaryKey(),
  id_project: integer("project_id").references(() => projects.id_project),
  task_name: text("name"),
  description: text("description"),
  deadline: timestamp("deadlineAt"),
  id_parent_task: integer("parent_task_id").references(() => tasks.id_task),
});

const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.id_project],
    references: [projects.id_project],
  }),
  tasksToUsers: many(tasksToUsers),
  tasksToTeams: many(tasksToTeams),
  parentTask: one(tasks, {
    fields: [tasks.id_parent_task],
    references: [tasks.id_task],
  }),
  childTasks: many(tasks),
}));

const tasksToUsers = pgTable(
  "tasks_to_users",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id_task),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id_user),
  },
  (t) => ({
    pk: primaryKey(t.taskId, t.userId),
  })
);

const tasksToTeams = pgTable(
  "tasks_to_teams",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id_task),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id_team),
  },
  (t) => ({
    pk: primaryKey(t.taskId, t.teamId),
  })
);

const tasksToTeamsRelations = relations(tasksToTeams, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToTeams.taskId],
    references: [tasks.id_task],
  }),
  team: one(teams, {
    fields: [tasksToTeams.teamId],
    references: [teams.id_team],
  }),
}));

const federatedCredentials = pgTable(
  "federated_credentials",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id_user),
    provider: text("provider"),
    subject: text("subject"),
  },
  (t) => ({
    unq: unique().on(t.provider, t.subject),
  })
);

module.exports = {
  teams,
  teamsRelations,
  users,
  usersRelations,
  usersToTeams,
  usersToTeamsRelations,
  projects,
  projectsRelations,
  teamsToProjects,
  tasks,
  tasksRelations,
  tasksToUsers,
  tasksToTeams,
  tasksToTeamsRelations,
  federatedCredentials,
};
