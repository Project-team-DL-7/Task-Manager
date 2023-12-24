const User = require("../domain/User");
const UserRepository = require("../infrastructure/storage/UserRepository");

class UserService {
  async getUserById(id_user) {
    console.log(`Get User with id_user: ${id_user}`);
    return UserRepository.findUserById(id_user);
  }

  async getAllUsersEntities(id_user) {
    const res = await UserRepository.findAllUsersEntities(id_user);
    const teams = res.usersToTeams.map((userToTeam) => userToTeam.team);
    delete res.usersToTeams;
    teams.forEach((team, i) => {
      teams[i].tasks = team.tasksToTeams.map((taskToTeam) => taskToTeam.task);
      delete teams[i].tasksToTeams;
    });
    const entitiesFormatted = { ...res, teams };
    return entitiesFormatted;
  }

  async createUser(user) {
    console.log(`Create new User ${JSON.stringify(user, null, 2)}`);
    return UserRepository.addUser(user);
  }

  async deleteUserById(id_user) {
    console.log(`Delete User with id_user: ${id_user}`);
    return UserRepository.deleteUserById(id_user);
  }

  async updateUser(user) {
    console.log(`Update User ${JSON.stringify(user, null, 2)}`);
    return UserRepository.updateUser(user);
  }
}

module.exports = new UserService();
