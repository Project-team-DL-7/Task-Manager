const { eq, and } = require("drizzle-orm");
const User = require("../../domain/User");
const { usersToTeams, users } = require("./schema");
const { db } = require("../../..");

class UserRepository {
  // Find a user by ID
  async findUserById(id_user) {
    const user = await db.query.users.findFirst({
      columns: {
        password: false
      },
      where: eq(users.id_user, id_user),
    });
    return user;
  }

  async findUserByUsername(username) {
    const user = await db.query.users.findFirst({
      columns: {
        password: false
      },
      where: eq(users.username, username),
    });
    return user;
  }

  async findUsersByTeamId(id_team) {
    const res = await db.select({
      id_user: users.id_user,
      email: users.email,
      username: users.username,
      registrationDate: users.registrationDate
    }).from(users).innerJoin(usersToTeams, and(eq(usersToTeams.teamId, id_team), eq(usersToTeams.userId, users.id_user)))

    return res;
  }

  async findAllUsersEntities(id_user) {
    const result = await db.query.users.findFirst({
      where: eq(users.id_user, id_user),
      columns: {
        password: false,
      },
      with: {
        usersToTeams: {
          with: {
            team: {
              with: {
                tasksToTeams: { with: { task: { with: { project: true } } } },
              },
            },
          },
        },
      },
    });
    return result;
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

  async isUserPartOfTeam(id_user, id_team) {
    const result = await db.query.usersToTeams.findFirst({
      where:
        and(
          eq(usersToTeams.userId, id_user),
          eq(usersToTeams.teamId, id_team)
        )
    })

    return !!result
  }


}

module.exports = new UserRepository();
