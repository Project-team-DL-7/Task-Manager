class Task {
  constructor(id_task, id_project, task_name, description, deadline) {
    this.id_task = id_task;
    this.id_project = id_project;
    this.task_name = task_name;
    this.description = description;
    this.deadline = deadline;
  }
}

module.exports = Task;
