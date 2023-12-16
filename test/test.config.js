const { Pool } = require('pg');

const isDocker = process.env.NODE_ENV === 'test';

const testDatabaseConfig = {
  user: 'testuser',
  host: isDocker ? 'postgres' : 'localhost',
  database: 'testdb',
  password: 'testpassword',
  port: 5432,
};

const testPool = new Pool(testDatabaseConfig);

module.exports = { testPool };