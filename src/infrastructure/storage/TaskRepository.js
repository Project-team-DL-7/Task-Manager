const { eq } = require("drizzle-orm");
const { db } = require("../../..");
const { tasks, tasksToTeams, teams, usersToTeams, users } = require("./schema");

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
        task_name: tasks.task_name,
        description: tasks.description,
        deadline: tasks.deadline,
        id_parent_task: tasks.id_parent_task,
      })
      .from(tasks)
      .innerJoin(tasksToTeams, eq(tasks.id_task, tasksToTeams.taskId))
      .innerJoin(teams, eq(tasksToTeams.teamId, teams.id_team))
      .innerJoin(usersToTeams, eq(teams.id_team, usersToTeams.teamId))
      .innerJoin(users, eq(users.id_user, usersToTeams.userId))
      .where(eq(users.id_user, id_user));
    return res;
  }

  // Add a new task
  async addTask(task) {
    const newTask = await db.transaction(async (tx) => {
      const res = await tx
        .insert(tasks)
        .values({ ...task, deadline: new Date(task.deadline) })
        .returning();
      return res[0];
    });
    return newTask;
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
}

module.exports = new TaskRepository();
