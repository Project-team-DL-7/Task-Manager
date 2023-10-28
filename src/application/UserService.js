const UserRepository = require('../infrastructure/storage/UserRepository');

class UserService {
  getUserById(id) {
    return UserRepository.findUserById(id);
  }

  createUser(user) {
    return UserRepository.addUser(user);
  }

  deleteUserById(user) {
    return UserRepository.deleteUserById(id);
  }

  updateUser(user) {
    return UserRepository.updateUser(user);
  }
}

module.exports = new UserService();
