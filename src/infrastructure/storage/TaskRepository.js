const { eq, and } = require("drizzle-orm");
const { db } = require("../../..");
const { tasks, projects, teamsToProjects, teams, usersToTeams, users } = require("./schema");

class TaskRepository {
  // Find a task by ID
  async findTaskById(id_task) {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id_task, id_task),
    });
    return task;
  }

  async findTasksByUserId(id_user) {
    const res = await db
      .select({
        id_task: tasks.id_task,
        id_project: tasks.id_project,
        id_user: tasks.id_user,
        task_name: tasks.task_name,
        description: tasks.description,
        deadline: tasks.deadline,
        id_parent_task: tasks.id_parent_task,
        status: tasks.status
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.id_project, projects.id_project))
      .innerJoin(teamsToProjects, eq(projects.id_project, teamsToProjects.projectId))
      .innerJoin(teams, eq(teamsToProjects.teamId, teams.id_team))
      .innerJoin(usersToTeams, eq(teams.id_team, usersToTeams.teamId))
      .innerJoin(users, eq(users.id_user, usersToTeams.userId))
      .where(eq(users.id_user, id_user));
    return res;
  }

  // Add a new task
  ADD_TASK_PROJECT_DOES_NOT_EXIST = "ADD_TASK_PROJECT_DOES_NOT_EXIST"
  ADD_TASK_USER_DOES_NOT_EXIST = "ADD_TASK_USER_DOES_NOT_EXIST"
  ADD_TASK_PARENT_TASK_DOES_NOT_EXIST = "ADD_TASK_PARENT_TASK_DOES_NOT_EXIST"
  async addTask(task) {
    try {
      const newTask = await db.transaction(async (tx) => {
        const res = await tx
          .insert(tasks)
          .values({ ...task, deadline: new Date(task.deadline) })
          .returning();
        return res[0];
      });
      return newTask;
    } catch (err) {
      if (err.constraint_name === "tasks_project_id_projects_id_fk") {
        return this.ADD_TASK_PROJECT_DOES_NOT_EXIST
      }
      if (err.constraint_name === "tasks_user_id_users_id_fk") {
        return this.ADD_TASK_USER_DOES_NOT_EXIST
      }
      if (err.constraint_name === "tasks_parent_task_id_tasks_id_fk") {
        return this.ADD_TASK_PARENT_TASK_DOES_NOT_EXIST
      }
      throw new Error(err)
    }
  }

  // Delete all subtasks of a task
  async deleteSubTasks(id_task) {
    const res = await db
      .delete(tasks)
      .where(eq(tasks.id_parent_task, id_task))
      .returning();
    return res;
  }

  // Delete a task by ID
  async deleteTaskById(id_task) {
    const res = await db
      .delete(tasks)
      .where(eq(tasks.id_task, id_task))
      .returning();
    return res.length ? res[0] : null;
  }

  // Update task details
  async updateTask(taskToUpdate) {
    const updatedTask = await db
      .update(tasks)
      .set({ ...taskToUpdate, deadline: new Date(taskToUpdate.deadline) })
      .where(eq(tasks.id_task, taskToUpdate.id_task))
      .returning();
    return updatedTask[0] ?? null;
  }

  async isTaskPartOfTeam(id_task, id_team) {
    const result = await db.select().from(tasks)
      .innerJoin(teamsToProjects, eq(tasks.id_project, teamsToProjects.projectId))
      .where(and(eq(teamsToProjects.teamId, id_team), eq(tasks.id_task, id_task)))

    return result.length !== 0
  }

  async isTaskAccesibleByUser(id_task, id_user) {
    const result = await db.select().from(tasks)
      .innerJoin(teamsToProjects, eq(tasks.id_project, teamsToProjects.projectId))
      .innerJoin(usersToTeams, eq(usersToTeams.teamId, teamsToProjects.teamId))
      .where(and(eq(usersToTeams.userId, id_user), eq(tasks.id_task, id_task)))

    return result.length !== 0
  }
}

module.exports = new TaskRepository();
