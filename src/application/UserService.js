const User = require('../domain/User');
const UserRepository = require('../infrastructure/storage/UserRepository');

class UserService {
  makePostUserInstance(user) {
    return new User(0, user.email, user.username, user.password, user.registrationDate);
  }

  makeUpdateUserInstance(user) {
    return new User(user.id_user, user.email, user.username, user.password, user.registrationDate);
  } 

  getUserById(id_user) {
    console.log(`Get User with id_user: ${id_user}`)
    return UserRepository.findUserById(id_user);
  }

  createUser(user) {
    const newUser = this.makePostUserInstance(user);
    console.log(`Create new User ${JSON.stringify(newUser, null, 2)}`);
    return UserRepository.addUser(newUser);
  }

  deleteUserById(id_user) {
    console.log(`Delete User with id_user: ${id_user}`)
    return UserRepository.deleteUserById(id_user);
  }

  updateUser(user) {
    const updatedUser = this.makeUpdateUserInstance(user);
    console.log(`Update User ${JSON.stringify(updatedUser, null, 2)}`);
    return UserRepository.updateUser(updatedUser);
  }
}

module.exports = new UserService();
