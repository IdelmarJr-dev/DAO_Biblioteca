const pool = require("../database/conexao");
const emprestimo = require("../models/emprestimo");

class emprestimoDao {
  static async registrarEmprestimo(livro_id, usuario_id) {
    const hoje = new Date().toISOString().split("T")[0];
    await pool.query(
      "INSERT emprestimos (livro_id, usuario_id, data_emprestimo) VALUES ($1, $2, $3)",
      [livro_id, usuario_id, hoje]
    );
    await pool.query("UPDATE livros SET disponivel = FALSE WHERE id = $1", [
      livro_id,
    ]);
  }
  static async registrarDevolucao(livro_id) {
    const hoje = new Date().toISOString().split("T")[0];
    await pool.query(
      "UPDATE emprestimos SET data_devolucao = $1 WHERE livro_id = $2 AND data_devolucao IS NULL",
      [hoje, livro_id]
    );
    await pool.query("UPDATE livros SET disponivel = TRUE WHERE id = $1", [
      livro_id,
    ]);
  }
  static async listarPorUsuario(usuario_id) {
    const res = await pool.query(
      `SELECT * FROM emprestimos WHERE usuario_id = $1 ORDER BY data_emprestimo DESC`,
      [usuario_id]
    );
    return res.rows.map(
      (row) =>
        new emprestimo(
          row.id,
          row.livro_id,
          row.usuario_id,
          row.data_emprestimo,
          row.data_devolucao
        )
    );
  }

  static async calcularMulta(livro_id) {
    const res = await pool.query(
      `SELECT data_emprestimo FROM emprestimos WHERE livro_id = $1 AND data_devolucao IS NULL`,
      [livro_id]
    );
    if (res.rows.length === 0) return 0;

    const dataEmprestimo = new Date(res.rows[0].data_emprestimo);
    const hoje = new Date();
    const dias = Math.floor((hoje - dataEmprestimo) / (1000 * 60 * 60 * 24));
    const limite = 7;
    const multaPorDia = 2;

    return dias > limite ? (dias - limite) * multaPorDia : 0;
  }
}
module.exports = emprestimoDao;
