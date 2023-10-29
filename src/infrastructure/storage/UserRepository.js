const User = require('../../domain/User');

class UserRepository {
  constructor() {
    // Dummy in-memory storage
    this.users = [
      new User(1, 'test1@email.com', 'user1', 'password1', Date.now()),
      new User(2, 'test2@email.com', 'user2', 'password2', Date.now()),
      // Add more users as necessary
    ];
  }

  // Find a user by ID
  findUserById(id_user) {
    return this.users.find(user => user.id_user == id_user) || null;
  }

  // Add a new user
  addUser(user) {
    user.id_user = (this.users[this.users.length - 1]).id_user + 1;
    this.users.push(user);
    return user;
  }

  // Delete a user by ID
  deleteUserById(id_user) {
    const userIndex = this.users.findIndex(user => user.id_user == id_user);
    if (userIndex != -1) {
      const [deletedUser] = this.users.splice(userIndex, 1);
      return deletedUser;
    }
    return null;
  }

  // Update user details
  updateUser(userToUpdate) {
    const userIndex = this.users.findIndex(user => user.id_user == userToUpdate.id_user);
    if (userIndex != -1) {
      this.users[userIndex] = userToUpdate;
      return userToUpdate;
    }
    return null;
  }
}

module.exports = new UserRepository();
  