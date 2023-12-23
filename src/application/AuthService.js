const FederatedCredentialsRepository = require("../infrastructure/storage/FederatedCredentialsRepository");
const UserRepository = require("../infrastructure/storage/UserRepository");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class AuthService {
  async handlePasswordVerification(username, password) {
    console.log(`Handle local verification for user ${username}`);
    const user = await UserRepository.findUserByUsername(username);
    if (!user) {
      return null;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return user;
    } else {
      return null;
    }
  }

  async signUp(username, password, email) {
    let hash = await bcrypt.hash(password, saltRounds);
    const newUser = await UserRepository.addUser({
      email,
      username,
      password: hash,
      registrationDate: Date.now(),
    });
    return newUser;
  }

  async handleOAuthVerification(provider, profile) {
    console.log(
      `Handle OAuth verification for user ${profile.id} with provider ${provider}`
    );
    console.log(`Users profile:`, profile);
    const federatedCredential =
      await FederatedCredentialsRepository.findByProviderAndSubjectId(
        provider,
        profile.id
      );
    if (federatedCredential) {
      return UserRepository.findUserById(federatedCredential.userId);
    } else {
      // TODO: refactor into a db transaction
      const newUser = await UserRepository.addUser({
        email: profile.emails[0].value,
        username: profile.displayName,
        password: "",
        registrationDate: Date.now(),
      });
      const newFederatedCredential = FederatedCredentialsRepository.create(
        newUser.id_user,
        provider,
        profile.id
      );
      return newUser;
    }
  }
}

module.exports = new AuthService();
