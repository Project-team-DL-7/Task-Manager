const Project = require("../domain/Project");
const ProjectRepository = require("../infrastructure/storage/ProjectRepository");

class ProjectService {
  async getProjectById(id) {
    console.log(`Get Project with id: ${id}`);
    return ProjectRepository.findProjectById(id);
  }

  async createProject(project) {
    console.log(`Create new Project ${JSON.stringify(project, null, 2)}`);
    return ProjectRepository.addProject(project);
  }

  async deleteProjectById(id) {
    console.log(`Delete Project with id: ${id}`);
    return ProjectRepository.deleteProjectById(id);
  }

  async updateProject(project) {
    console.log(`Update Project ${JSON.stringify(project, null, 2)}`);
    return ProjectRepository.updateProject(project);
  }
}

module.exports = new ProjectService();
