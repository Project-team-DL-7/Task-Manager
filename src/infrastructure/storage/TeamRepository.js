const { eq } = require("drizzle-orm");
const { db } = require("../../..");
const Team = require("../../domain/Team");
const { teams, teamsToProjects, usersToTeams, users } = require("./schema");

class TeamRepository {
  // Find a team by ID
  async findTeamById(id_team) {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id_team, id_team),
    });
    return team;
  }

  async findTeamsByUserId(id_user) {
    const res = await db
      .select({
        id_team: teams.id_team,
        team_name: teams.team_name,
        description: teams.description,
      })
      .from(teams)
      .innerJoin(usersToTeams, eq(teams.id_team, usersToTeams.teamId))
      .innerJoin(users, eq(users.id_user, usersToTeams.userId))
      .where(eq(users.id_user, id_user));
    return res;
  }

  // Add a new team
  async addTeam(team, userId) {
    const newTeam = await db.transaction(async (tx) => {
      const res = await tx.insert(teams).values(team).returning();
      const newTeam = res[0];
      await tx
        .insert(usersToTeams)
        .values({ teamId: newTeam.id_team, userId: userId });

      return newTeam;
    });
    return newTeam;
  }

  // Delete a team by ID
  async deleteTeamById(id_team) {
    const res = await db.transaction(async (tx) => {
      // Delete the corresponding records in the users_to_teams table
      await tx.delete(usersToTeams).where(eq(usersToTeams.teamId, id_team));

      // Delete the corresponding records in the teams_to_projects table
      await tx.delete(teamsToProjects).where(eq(teamsToProjects.teamId, id_team));

      // Delete the team
      const deleteRes = await tx.delete(teams).where(eq(teams.id_team, id_team)).returning();
      return deleteRes.length ? deleteRes[0] : null;
    });
    return res;
  }

  // Update team details
  async updateTeam(teamToUpdate) {
    const updatedTeam = await db
      .update(teams)
      .set({ 
        description: teamToUpdate.description,
        team_name: teamToUpdate.team_name
      })
      .where(eq(teams.id_team, teamToUpdate.id_team))
      .returning();
    return updatedTeam[0] ?? null;
  }
}

module.exports = new TeamRepository();
