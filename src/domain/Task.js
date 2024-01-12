class Task {
  constructor(
    id_task,
    id_project,
    task_name,
    description,
    deadline,
    id_parent_task,
    status
  ) {
    this.id_task = id_task;
    this.id_project = id_project;
    this.task_name = task_name;
    this.description = description;
    this.deadline = deadline;
    this.id_parent_task = id_parent_task;
    this.status = status;
  }
}

module.exports = Task;
