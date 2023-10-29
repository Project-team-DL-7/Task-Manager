const Task = require('../domain/Task');
const TaskRepository = require('../infrastructure/storage/TaskRepository');

class TaskService {
  makePostTaskInstance(task) {
    return new Task(0, task.id_project, task.task_name, task.description, task.deadline);
  }

  makeUpdateTaskInstance(task) {
    return new Task(task.id_task, task.id_project, task.task_name, task.description, task.deadline);
  }

  getTaskById(id_task) {
    console.log(`Get Task with id_task: ${id_task}`)
    return TaskRepository.findTaskById(id_task);
  }

  createTask(task) {
    const newTask = this.makePostTaskInstance(task);
    console.log(`Create new ${JSON.stringify(newTask, null, 2)}`);
    return TaskRepository.addTask(newTask);
  }

  deleteTaskById(id_task) {
    console.log(`Delete Task with id_task: ${id_task}`)
    return TaskRepository.deleteTaskById(id_task);
  }

  updateTask(task) {
    const updatedTask = this.makeUpdateTaskInstance(task);
    console.log(`Update ${JSON.stringify(updatedTask, null, 2)}`);
    return TaskRepository.updateTask(updatedTask);
  }
}

module.exports = new TaskService();
