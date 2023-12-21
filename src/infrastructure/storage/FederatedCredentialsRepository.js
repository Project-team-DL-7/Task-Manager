const { eq, and } = require("drizzle-orm");
const { federatedCredentials } = require("./schema");
const { db } = require("../../..");

class FederatedCredentialsRepository {
  async findByProviderAndSubjectId(provider, subjectId) {
    const federatedCredential = await db.query.federatedCredentials.findFirst({
      where: and(
        eq(federatedCredentials.provider, provider),
        eq(federatedCredentials.subject, subjectId)
      ),
    });
    return federatedCredential;
  }

  async create(userId, provider, subjectId) {
    const createdFederatedCredential = await db
      .insert(federatedCredentials)
      .values({ userId, provider, subject: subjectId })
      .returning();
    return createdFederatedCredential[0];
  }
}

module.exports = new FederatedCredentialsRepository();
