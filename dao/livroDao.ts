import { query } from "../database/conexao";
import Livro from "../models/livro";
import { calcularMulta } from "./emprestimoDao";

export async function inserir(livro: Livro) {
  const sql =
    "INSERT INTO livros (titulo, autor, ano, disponivel) VALUES ($1, $2, $3, $4) RETURNING id";
  const values = [livro.titulo, livro.autor, livro.ano, livro.disponibilidade];
  const result = await query(sql, values);
  return result.rows[0].id;
}

export async function listar() {
  const result = await query("SELECT * FROM livros");
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

export async function alugar(id: number) {
  await query("UPDATE livros SET disponivel = FALSE WHERE id = $1", [id]);
}

export async function devolver(id: number) {
  await query("UPDATE livros SET disponivel = TRUE WHERE id = $1", [id]);
}

export async function verificarMulta(id: number) {
  return await calcularMulta(id);
}
