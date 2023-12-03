const { eq } = require("drizzle-orm");
const { db } = require("../../..");
const Team = require("../../domain/Team");
const { teams } = require("./schema");

class TeamRepository {
  // Find a team by ID
  async findTeamById(id_team) {
    const team = await db.query.teams.findFirst({
      where: eq(teams.id_team, id_team),
    });
    return team;
  }

  // Add a new team
  async addTeam(team) {
    const res = await db.insert(teams).values(team).returning();
    return res[0];
  }

  // Delete a team by ID
  async deleteTeamById(id_team) {
    const res = await db
      .delete(teams)
      .where(eq(teams.id_team, id_team))
      .returning();
    return res.length ? res[0] : null;
  }

  // Update team details
  async updateTeam(teamToUpdate) {
    const updatedTeam = await db
      .update(teams)
      .set({ description: teamToUpdate.description })
      .where(eq(teams.id_team, teamToUpdate.id_team))
      .returning();
    return updatedTeam[0] ?? null;
  }
}

module.exports = new TeamRepository();
