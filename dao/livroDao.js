import { query as _query } from "../database/conexao";
import Livro from "../models/livro";
import { calcularMulta } from "./emprestimoDao";
class LivroDao {
  static async inserir(livro) {
    const query =
      "INSERT INTO livros (titulo, autor, ano, disponivel) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [livro.titulo, livro.autor, livro.ano, livro.disponivel];
    const result = await _query(query, values);
    return result.rows[0].id;
  }
  static async listar() {
    const result = await _query("SELECT * FROM livros");
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
    await _query("UPDATE livros SET disponivel = FALSE WHERE id = $1", [id]);
  }
  static async devolver(id) {
    await _query("UPDATE livros SET disponivel = TRUE WHERE id = $1", [id]);
  }
  static async verificarMulta(id) {
    return await calcularMulta(id);
  }
}
export default LivroDao;
