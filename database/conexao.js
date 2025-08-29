const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.SESSION_SECRET,
  ssl: {
    rejectUnauthorized: false, // necessário para Railway
  },
});

module.exports = pool;
