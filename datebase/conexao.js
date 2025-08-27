const { Pool } = require("pg");
const pool = new Pool({
  user: "test",
  host: "localhost",
  database: "biblioteca",
  password: "test1234",
  port: 5432,
});

module.exports = pool;
