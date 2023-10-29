const Team = require('../../domain/Team');

class TeamRepository {
  constructor() {
    // Dummy in-memory storage
    this.teams = [
      new Team(1, 'Team Alpha', 'Description for Team Alpha'),
      new Team(2, 'Team Beta', 'Description for Team Beta'),
      // Add more teams as necessary
    ];
  }

  // Find a team by ID
  findTeamById(id_team) {
    return this.teams.find(team => team.id_team == id_team) || null;
  }

  // Add a new team
  addTeam(team) {
    team.id_team = (this.teams[this.teams.length - 1]).id_team + 1;
    this.teams.push(team);
    return team;
  }

  // Delete a team by ID
  deleteTeamById(id_team) {
    const teamIndex = this.teams.findIndex(team => team.id_team == id_team);
    if (teamIndex != -1) {
      const [deletedTeam] = this.teams.splice(teamIndex, 1);
      return deletedTeam;
    }
    return null;
  }

  // Update team details
  updateTeam(teamToUpdate) {
    const teamIndex = this.teams.findIndex(team => team.id_team == teamToUpdate.id_team);
    if (teamIndex != -1) {
      this.teams[teamIndex] = teamToUpdate;
      return teamToUpdate;
    }
    return null;
  }
}

module.exports = new TeamRepository();
