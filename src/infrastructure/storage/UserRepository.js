const { eq } = require("drizzle-orm");
const User = require("../../domain/User");
const { users } = require("./schema");
const { db } = require("../../..");

class UserRepository {
  // Find a user by ID
  async findUserById(id_user) {
    const user = await db.query.users.findFirst({
      where: eq(users.id_user, id_user),
    });
    return user;
  }

  async findUserByUsername(username) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user;
  }

  // Add a new user
  async addUser(user) {
    const res = await db
      .insert(users)
      .values({
        ...user,
        registrationDate: new Date(user.registrationDate),
      })
      .returning();
    return res[0];
  }

  // Delete a user by ID
  async deleteUserById(id_user) {
    const res = await db
      .delete(users)
      .where(eq(users.id_user, id_user))
      .returning();
    return res.length ? res[0] : null;
  }

  // Update user details
  async updateUser(userToUpdate) {
    const updatedUser = await db
      .update(users)
      .set({
        ...userToUpdate,
        registrationDate: new Date(userToUpdate.registrationDate),
      })
      .where(eq(users.id_user, userToUpdate.id_user))
      .returning();
    return updatedUser[0] ?? null;
  }
}

module.exports = new UserRepository();
