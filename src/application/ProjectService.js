const Project = require('../domain/Project');
const ProjectRepository = require('../infrastructure/storage/ProjectRepository');

class ProjectService {
  makePostProjectInstance(project) {
    return new Project(0, project.description)
  }

  makeUpdateProjectInstance(project) {
    return new Project(project.id_project, project.description)
  }

  getProjectById(id_project) {
    console.log(`Get Project with id_project: ${id_project}`)
    return ProjectRepository.findProjectById(id_project);
  }

  createProject(project) {
    const newProject = this.makePostProjectInstance(project);
    console.log(`Create new Project ${JSON.stringify(newProject, null, 2)}`);
    return ProjectRepository.addProject(newProject);
  }

  deleteProjectById(id_project) {
    console.log(`Delete Project with id_project: ${id_project}`)
    return ProjectRepository.deleteProjectById(id_project);
  }

  updateProject(project) {
    const updatedProject = this.makeUpdateProjectInstance(project);
    console.log(`Update Project ${JSON.stringify(updatedProject, null, 2)}`);
    return ProjectRepository.updateProject(updatedProject);
  }
}

module.exports = new ProjectService();
