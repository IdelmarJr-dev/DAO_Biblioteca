const { Pool } = require("pg");
const pool = new Pool({
  user: "devuser",
  host: "localhost",
  database: "biblioteca",
  password: "devsenha",
  port: 5432,
});

module.exports = pool;
