const pool = require("../datebase/conexao");
const Livro = require("../models/livro");
const EmprestimoDao = require("./emprestimodao");
class LivroDao {
  static async inserir(livro) {
    const query =
      "INSERT INTO livros (titulo, autor, ano_de_publicacao, disponivel) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [
      livro.titulo,
      livro.autor,
      livro.ano_de_publicacao,
      livro.disponivel,
    ];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }
  static async listar() {
    const result = await pool.query("SELECT * FROM livros");
    return result.rows.map(
      (row) =>
        new Livro(
          row.id,
          row.titulo,
          row.autor,
          row.ano_de_publicacao,
          row.disponivel
        )
    );
  }
  static async alugar(id) {
    await pool.query("UPDATE livros SET disponivel = FALSE WHERE id = $1", [
      id,
    ]);
  }
  static async devolver(id) {
    await pool.query("UPDATE livros SET disponivel = TRUE WHERE id = $1", [id]);
  }
  static async verificarMulta(id) {
    return await EmprestimoDao.calcularMulta(id);
  }
}
module.exports = LivroDao;
