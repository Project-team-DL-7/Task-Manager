const { Pool } = require('pg');

const testDatabaseConfig = {
  user: 'testuser',
  host: 'localhost',
  database: 'testdb',
  password: 'testpassword',
  port: 5432,
};

const testPool = new Pool(testDatabaseConfig);

module.exports = { testPool };