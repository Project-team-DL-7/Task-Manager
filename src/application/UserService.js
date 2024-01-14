const User = require("../domain/User");
const UserRepository = require("../infrastructure/storage/UserRepository");

class UserService {
  async getUserById(id_user) {
    console.log(`Get User with id_user: ${id_user}`);
    return UserRepository.findUserById(id_user);
  }

  async getUsersByTeamId(id_team) {
    return UserRepository.findUsersByTeamId(id_team)
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

  async isUserPartOfTeam(id_user, id_team) {
    return UserRepository.isUserPartOfTeam(id_user, id_team)
  }

  async getUserByUsername(username) {
    console.log(`Get User with username: ${username}`);
    const user = await UserRepository.findUserByUsernameIncludingPassword(username);
    return user;
  }
}

module.exports = new UserService();
