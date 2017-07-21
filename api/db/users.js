const db = require('../db');

const create = props =>
  db.query('INSERT INTO users (username, password) VALUES($1, crypt($2, gen_salt(\'bf\')))', [props.username, props.password])
    .then(() => exports.getUserByUsername(props.username));

const getUserByUsername = username =>
  db.query('SELECT id, username FROM users WHERE username=$1 LIMIT 1', [username])
    .then(results => results.rows[0]);

const login = props =>
  db.query('SELECT id, username FROM users WHERE username=$1 AND password = crypt($2, password) LIMIT 1', [props.username, props.password])
    .then(results => results.rows[0]);

exports.create = create;
exports.getUserByUsername = getUserByUsername;
exports.login = login;
