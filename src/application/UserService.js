const User = require('../domain/User');
const UserRepository = require('../infrastructure/storage/UserRepository');

class UserService {
  makePostUserInstance(user) {
    return new User(0, user.email, user.username, user.password, user.registrationDate);
  }

  makeUpdateUserInstance(user) {
    return new User(user.id, user.email, user.username, user.password, user.registrationDate);
  } 

  getUserById(id) {
    console.log(`Get User with id: ${id}`)
    return UserRepository.findUserById(id);
  }

  createUser(user) {
    const newUser = this.makePostUserInstance(user);
    console.log(`Create new ${JSON.stringify(newUser, null, 2)}`);
    return UserRepository.addUser(newUser);
  }

  deleteUserById(id) {
    console.log(`Delete User with id: ${id}`)
    return UserRepository.deleteUserById(id);
  }

  updateUser(user) {
    const updatedUser = this.makeUpdateUserInstance(user);
    console.log(`Update ${JSON.stringify(updatedUser, null, 2)}`);
    return UserRepository.updateUser(updatedUser);
  }
}

module.exports = new UserService();
