// test.js
const pool = require("./database/conexao");

async function testarConexao() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conectado com sucesso:", res.rows[0]);
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
  } finally {
    await pool.end();
  }
}

testarConexao();
