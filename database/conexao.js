const { Pool } = require("pg");
//TODO: CASO QUEIRAM ESSES PARAMETROS DE POOL DEVERIAM SER VARIAAVEIS DE AMVBIENTE
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblioteca",
  password: "@Idel140211",
  port: 5432,
});

module.exports = pool;
