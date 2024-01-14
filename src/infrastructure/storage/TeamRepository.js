const { eq, and } = require("drizzle-orm");
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

  async findTeamByProjectId(id_project) {
    const res = await db.select({
      id_team: teams.id_team,
      team_name: teams.team_name,
      description: teams.description,
    }).from(teams).innerJoin(teamsToProjects, eq(teams.id_team, teamsToProjects.teamId))
      .where(eq(teamsToProjects.projectId, id_project))
    return res[0] ?? null
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

  INVITE_USER_TEAM_DOES_NOT_EXIST = "INVITE_USER_TEAM_DOES_NOT_EXIST"
  INVITE_USER_USER_DOES_NOT_EXIST = "INVITE_USER_USER_DOES_NOT_EXIST"
  INVITE_USER_INVITATION_ALREADY_EXISTS = "INVITE_USER_INVITATION_ALREADY_EXISTS"
  async inviteUser(id_team, id_user) {
    try {
      const res = await db.insert(usersToTeams).values({ teamId: id_team, userId: id_user }).returning()
      return res[0]
    }
    catch (err) {
      if (err.constraint_name === "users_to_teams_user_id_team_id") {
        return this.INVITE_USER_INVITATION_ALREADY_EXISTS
      }
      if (err.constraint_name === "users_to_teams_team_id_teams_id_fk") {
        return this.INVITE_USER_TEAM_DOES_NOT_EXIST
      }
      if (err.constraint_name === "users_to_teams_user_id_users_id_fk") {
        return this.INVITE_USER_USER_DOES_NOT_EXIST
      }
      throw new Error(err)
    }
  }

  async removeUser(id_team, id_user) {
    try {
      const res = await db.delete(usersToTeams).where(and(eq(usersToTeams.teamId, id_team), eq(usersToTeams.userId, id_user))).returning()
      console.log(res)
      return res.length !== 0
    }
    catch (err) {
      return null
    }
  }
}

module.exports = new TeamRepository();
