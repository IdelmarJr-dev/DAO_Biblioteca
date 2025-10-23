// test.js
import { query, end } from "./database/conexao.js";

async function testarConexao() {
  try {
    const res = await query("SELECT NOW()");
    console.log("Conectado com sucesso:", res.rows[0]);
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
  } finally {
    await end();
  }
}

testarConexao();
