class User {
  constructor(id_user, email, username, password, registrationDate) {
    this.id_user = id_user;
    this.email = email;
    this.username = username;
    this.password = password;
    this.registrationDate = registrationDate;
  }
}

module.exports = User;
