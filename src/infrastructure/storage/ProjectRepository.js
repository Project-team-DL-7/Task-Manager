const { eq } = require("drizzle-orm");
const { db } = require("../../..");
const {
  projects,
  teamsToProjects,
  teams,
  usersToTeams,
  users,
} = require("./schema");

class ProjectRepository {
  // Find a project by ID
  async findProjectById(id_project) {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id_project, id_project),
    });
    return project;
  }

  async findProjectsByUserId(id_user) {
    const res = await db
      .select({
        id_project: projects.id_project,
        name: projects.name,
        description: projects.description,
      })
      .from(projects)
      .innerJoin(
        teamsToProjects,
        eq(projects.id_project, teamsToProjects.projectId)
      )
      .innerJoin(teams, eq(teamsToProjects.teamId, teams.id_team))
      .innerJoin(usersToTeams, eq(teams.id_team, usersToTeams.teamId))
      .innerJoin(users, eq(users.id_user, usersToTeams.userId))
      .where(eq(users.id_user, id_user));
    return res;
  }

  // Add a new project
  async addProject(project) {
    const newProject = await db.transaction(async (tx) => {
      const res = await tx.insert(projects).values(project).returning();
      const newProject = res[0];
      await tx
        .insert(teamsToProjects)
        .values({ teamId: project.id_team, projectId: newProject.id_project });
      return newProject;
    });
    return newProject;
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
