// Update with your config settings.
//npx knex migrate:make user_table
//npm knex migrate:latest

require('dotenv').config();
const host = `${process.env.DB_HOST}`;
const user = `${process.env.DB_USER}`;
const password = `${process.env.DB_PASSWORD}`;
const database = `${process.env.DB_DATABASE}`;
const port = `${process.env.DB_PORT}`;

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: `${host}`,
      user: `${user}`,
      password: `${password}`,
      database: `${database}`,
      port: `${port}`,
    },

    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'mysql',
    connection: {
      host: `${host}`,
      user: `${user}`,
      password: `${password}`,
      database: `${database}`,
      port: `${port}`,
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: `${host}`,
      user: `${user}`,
      password: `${password}`,
      database: `${database}`,
      port: `${port}`,
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },
};
