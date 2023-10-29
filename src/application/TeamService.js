const Team = require('../domain/Team');
const TeamRepository = require('../infrastructure/storage/TeamRepository');

class TeamService {
  makePostTeamInstance(team) {
    return new Team(0, team.team_name, team.description);
  }

  makeUpdateTeamInstance(team) {
    return new Team(team.id_team, team.team_name, team.description);
  }
  
  getTeamById(id_team) {
    console.log(`Get Team with id_team: ${id_team}`)
    return TeamRepository.findTeamById(id_team);
  }

  createTeam(team) {
    const newTeam = this.makePostTeamInstance(team);
    console.log(`Create new ${JSON.stringify(newTeam, null, 2)}`);
    return TeamRepository.addTeam(newTeam);
  }

  deleteTeamById(id_team) {
    console.log(`Delete Team with id_team: ${id_team}`)
    return TeamRepository.deleteTeamById(id_team);
  }

  updateTeam(team) {
    const updatedTeam = this.makeUpdateTeamInstance(team);
    console.log(`Update ${JSON.stringify(updatedTeam, null, 2)}`);
    return TeamRepository.updateTeam(updatedTeam);
  }
}

module.exports = new TeamService();
