const ProjectRepository = require('../infrastructure/storage/ProjectRepository');

class ProjectService {
  getProjectById(id_project) {
    return ProjectRepository.findProjectById(id_project);
  }

  createProject(project) {
    return ProjectRepository.addProject(project);
  }

  deleteProjectById(id_project) {
    return ProjectRepository.deleteProjectById(id_project);
  }

  updateProject(project) {
    return ProjectRepository.updateProject(project);
  }
}

module.exports = new ProjectService();
