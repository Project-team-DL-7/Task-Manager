const TeamRepository = require('../infrastructure/storage/TeamRepository');

class TeamService {
  getTeamById(id_team) {
    return TeamRepository.findTeamById(id_team);
  }

  createTeam(team) {
    return TeamRepository.addTeam(team);
  }

  deleteTeamById(id_team) {
    return TeamRepository.deleteTeamById(id_team);
  }

  updateTeam(team) {
    return TeamRepository.updateTeam(team);
  }
}

module.exports = new TeamService();
