require('dotenv').config();
const { DATABASE, DB_USER, DB_PASSWORD, DB_DIALECT,HOST, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
    host: HOST,
    port:DB_PORT,
    dialect: DB_DIALECT,
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
    host: HOST,
    port:DB_PORT,
    dialect: DB_DIALECT,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
    host: HOST,
    port:DB_PORT,
    dialect: DB_DIALECT,
  },
};
