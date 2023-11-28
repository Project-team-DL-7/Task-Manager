const { eq } = require("drizzle-orm");
const db = require("../../..");
const { tasks } = require("./schema");

class TaskRepository {
  // Find a task by ID
  async findTaskById(id_task) {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id_task, id_task),
    });
    return task;
  }

  // Add a new task
  async addTask(task) {
    const createdTask = await db
      .insert(tasks)
      .values({ ...task, deadline: new Date(task.deadline) })
      .returning();
    return createdTask;
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
