class Task {
  constructor(id_task, id_project, task_name, description, unix_time_deadline) {
    this.id_task = id_task;
    this.id_project = id_project;
    this.task_name = task_name;
    this.description = description;
    this.unix_time_deadline = unix_time_deadline;
  }
}

module.exports = Task;
