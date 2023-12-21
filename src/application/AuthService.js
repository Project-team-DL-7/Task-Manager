const FederatedCredentialsRepository = require("../infrastructure/storage/FederatedCredentialsRepository");
const UserRepository = require("../infrastructure/storage/UserRepository");

class AuthService {
  async handleVerification(provider, profile) {
    console.log(
      `Handle verification for user ${profile.id} with provider ${provider}`
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
