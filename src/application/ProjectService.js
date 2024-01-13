const Project = require("../domain/Project");
const ProjectRepository = require("../infrastructure/storage/ProjectRepository");

class ProjectService {
  async getProjectById(id) {
    console.log(`Get Project with id: ${id}`);
    return ProjectRepository.findProjectById(id);
  }

  async getUsersProjects(user_id) {
    return ProjectRepository.findProjectsByUserId(user_id)
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

  async isProjectPartOfTeam(id_project, id_team) {
    return ProjectRepository.isProjectPartOfTeam(id_project, id_team)
  }
}

module.exports = new ProjectService();
