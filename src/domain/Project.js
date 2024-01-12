class Project {
  constructor(id_project, name, description, id_team) {
    this.id_project = id_project;
    this.name = name; 
    this.description = description;
    this.id_team = id_team;
  }
}

module.exports = Project;