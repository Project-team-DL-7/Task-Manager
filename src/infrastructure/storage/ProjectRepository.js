const { eq } = require("drizzle-orm");
const { db } = require("../../..");
const { projects } = require("./schema");

class ProjectRepository {
  // Find a project by ID
  async findProjectById(id_project) {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id_project, id_project),
    });
    return project;
  }

  // Add a new project
  async addProject(project) {
    const res = await db.insert(projects).values(project).returning();
    return res[0];
  }

  // Delete a project by ID
  async deleteProjectById(id_project) {
    const res = await db
      .delete(projects)
      .where(eq(projects.id_project, id_project))
      .returning();
    return res.length ? res[0] : null;
  }

  // Update project details
  async updateProject(projectToUpdate) {
    const updatedProject = await db
      .update(projects)
      .set({ description: projectToUpdate.description })
      .where(eq(projects.id_project, projectToUpdate.id_project))
      .returning();
    return updatedProject[0] ?? null;
  }
}

module.exports = new ProjectRepository();
