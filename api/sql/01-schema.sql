DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id        serial primary key,
  username  varchar(20) not null,
  password  varchar(60) not null
);
