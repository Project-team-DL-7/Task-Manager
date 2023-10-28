const TaskRepository = require('../infrastructure/storage/TaskRepository');

class TaskService {
  getTaskById(id_task) {
    return TaskRepository.findTaskById(id_task);
  }

  createTask(task) {
    return TaskRepository.addTask(task);
  }

  deleteTaskById(id_task) {
    return TaskRepository.deleteTaskById(id_task);
  }

  updateTask(task) {
    return TaskRepository.updateTask(task);
  }
}

module.exports = new TaskService();
