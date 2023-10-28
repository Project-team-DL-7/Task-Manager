class ProjectRepository {
  constructor() {
    // Dummy in-memory storage
    this.projects = [
      new Project(1, 'Description for Project One'),
      new Project(2, 'Description for Project Two'),
      // Add more projects as necessary
    ];
  }

  // Find a project by ID
  findProjectById(id_project) {
    return this.projects.find(project => project.id_project === id_project) || null;
  }

  // Add a new project
  addProject(project) {
    this.projects.push(project);
    return project;
  }

  // Delete a project by ID
  deleteProjectById(id_project) {
    const projectIndex = this.projects.findIndex(project => project.id_project === id_project);
    if (projectIndex !== -1) {
      const [deletedProject] = this.projects.splice(projectIndex, 1);
      return deletedProject;
    }
    return null;
  }

  // Update project details
  updateProject(projectToUpdate) {
    const projectIndex = this.projects.findIndex(project => project.id_project === projectToUpdate.id_project);
    if (projectIndex !== -1) {
      this.projects[projectIndex] = projectToUpdate;
      return projectToUpdate;
    }
    return null;
  }
}

module.exports = ProjectRepository;
