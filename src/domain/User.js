class User {
  constructor(id, email, username, password, registrationDate) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.registrationDate = registrationDate;
  }
}

module.exports = User;
