const { relations } = require("drizzle-orm");
const {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  uniqueIndex,
  primaryKey,
} = require("drizzle-orm/pg-core");

const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
  },
  (teams) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(teams.name),
    };
  }
);

const teamsRelations = relations(teams, ({ many }) => ({
  usersToTeams: many(usersToTeams),
  teamsToProjects: many(teamsToProjects),
  tasksToTeams: many(tasksToTeams),
}));

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
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
      .references(() => users.id),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.teamId),
  })
);

const usersToTeamsRelations = relations(usersToTeams, ({ one }) => ({
  team: one(teams, {
    fields: [usersToTeams.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [usersToTeams.userId],
    references: [users.id],
  }),
}));

const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  description: text("description"),
});

const projectsRelations = relations("projects", ({ one, many }) => ({
  teamsToProjects: many(teamsToProjects),
  tasks: many(tasks),
}));

const teamsToProjects = pgTable(
  "teams_to_projects",
  {
    teamId: integer("team_id")
      .notNull()
      .references(() => users.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (t) => ({
    pk: primaryKey(t.teamId, t.projectId),
  })
);

const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  name: text("name"),
  description: text("description"),
  deadlineAt: timestamp("deadlineAt"),
  parentTaskId: integer("parent_task_id").references(() => tasks.id),
});

const tasksRelations = relations("tasks", ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  tasksToUsers: many(tasksToUsers),
  tasksToTeams: many(tasksToTeams),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
  }),
  childTasks: many(tasks),
}));

const tasksToUsers = pgTable(
  "tasks_to_users",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
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
      .references(() => tasks.id),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
  },
  (t) => ({
    pk: primaryKey(t.taskId, t.teamId),
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
};
