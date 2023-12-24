const TeamRepository = require("../infrastructure/storage/TeamRepository");

class TeamService {
  async getTeamById(id_team) {
    console.log(`Get Team with id_team: ${id_team}`);
    return TeamRepository.findTeamById(id_team);
  }

  async createTeam(team, userId) {
    console.log(`Create new Team ${JSON.stringify(team, null, 2)}`);
    return TeamRepository.addTeam(team, userId);
  }

  async deleteTeamById(id_team) {
    console.log(`Delete Team with id_team: ${id_team}`);
    return TeamRepository.deleteTeamById(id_team);
  }

  async updateTeam(team) {
    console.log(`Update Team ${JSON.stringify(team, null, 2)}`);
    return TeamRepository.updateTeam(team);
  }
}

module.exports = new TeamService();
