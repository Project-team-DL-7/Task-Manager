const User = require("../domain/User");
const UserRepository = require("../infrastructure/storage/UserRepository");

class UserService {
  getUserById(id_user) {
    console.log(`Get User with id_user: ${id_user}`);
    return UserRepository.findUserById(id_user);
  }

  createUser(user) {
    console.log(`Create new User ${JSON.stringify(user, null, 2)}`);
    return UserRepository.addUser(user);
  }

  deleteUserById(id_user) {
    console.log(`Delete User with id_user: ${id_user}`);
    return UserRepository.deleteUserById(id_user);
  }

  updateUser(user) {
    console.log(`Update User ${JSON.stringify(user, null, 2)}`);
    return UserRepository.updateUser(user);
  }
}

module.exports = new UserService();
