const pg = require('pg');
const config = require('../config');

const connectionString = config.get('psql-connection-string');
const client = new pg.Client(connectionString);
client.connect();

module.exports = {
  query: (text, params) => client.query(text, params)
};
