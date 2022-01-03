const knex = require('knex');
const configuration = require('../../knexfile');

require('dotenv/config');


const environment = process.env.ENVIRONMENT;

if (environment == 'development') {
  const connection = knex(configuration.development);

  module.exports = connection;
} else {
  const connection = knex(configuration.production);
  module.exports = connection;
}
