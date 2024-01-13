const Task = require("../domain/Task");
const TaskRepository = require("../infrastructure/storage/TaskRepository");

class TaskService {
  async getTaskById(id_task) {
    console.log(`Get Task with id_task: ${id_task}`);
    return TaskRepository.findTaskById(id_task);
  }

  async getUsersTasks(user_id) {
    return TaskRepository.findTasksByUserId(user_id)
  }

  async createTask(task) {
    console.log(`Create new Task ${JSON.stringify(task, null, 2)}`);
    return TaskRepository.addTask(task);
  }

  async deleteTaskById(id_task) {
    console.log(`Delete Task with id_task: ${id_task}`);
    return TaskRepository.deleteTaskById(id_task);
  }

  async updateTask(task) {
    console.log(`Update Task ${JSON.stringify(task, null, 2)}`);
    return TaskRepository.updateTask(task);
  }

  async isTaskPartOfTeam(id_task, id_team) {
    return TaskRepository.isTaskPartOfTeam(id_task, id_team)
  }

  async isTaskAccesibleByUser(id_task, id_user) {
    return TaskRepository.isTaskAccesibleByUser(id_task, id_user)
  }
}

module.exports = new TaskService();
