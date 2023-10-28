const UserRepository = require('../infrastructure/storage/UserRepository');

class UserManager {
  getUserById(id) {
    return UserRepository.findUserById(id);
  }

  createUser(user) {
    return UserRepository.addUser(user);
  }
}

module.exports = new UserManager();