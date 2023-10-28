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
  findUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  // Add a new user
  addUser(user) {
    this.users.push(user);
    return user;
  }

  // Delete a user by ID
  deleteUserById(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      const [deletedUser] = this.users.splice(userIndex, 1);
      return deletedUser;
    }
    return null;
  }

  // Update user details
  updateUser(userToUpdate) {
    const userIndex = this.users.findIndex(user => user.id === userToUpdate.id);
    if (userIndex !== -1) {
      this.users[userIndex] = userToUpdate;
      return userToUpdate;
    }
    return null;
  }
}

module.exports = UserRepository;
  