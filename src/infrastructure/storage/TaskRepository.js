const Task = require('../../domain/Task');

class TaskRepository {
  constructor() {
    // Dummy in-memory storage
    this.tasks = [
      new Task(1, 1, 'Task One', 'Description for Task One', 1672444800),  // Unix time example
      new Task(2, 1, 'Task Two', 'Description for Task Two', 1675046400),  // Unix time example
      // Add more tasks as necessary
    ];
  }

  // Find a task by ID
  findTaskById(id_task) {
    return this.tasks.find(task => task.id_task === id_task) || null;
  }

  // Add a new task
  addTask(task) {
    this.tasks.push(task);
    return task;
  }

  // Delete a task by ID
  deleteTaskById(id_task) {
    const taskIndex = this.tasks.findIndex(task => task.id_task === id_task);
    if (taskIndex !== -1) {
      const [deletedTask] = this.tasks.splice(taskIndex, 1);
      return deletedTask;
    }
    return null;
  }

  // Update task details
  updateTask(taskToUpdate) {
    const taskIndex = this.tasks.findIndex(task => task.id_task === taskToUpdate.id_task);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = taskToUpdate;
      return taskToUpdate;
    }
    return null;
  }
}

module.exports = new TaskRepository();
  