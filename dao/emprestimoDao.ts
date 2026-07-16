import { query } from "../database/conexao";
import Emprestimo from "../models/emprestimo";

export async function registrarEmprestimo(livro_id: number, usuario_id: number) {
  const hoje = new Date().toISOString().split("T")[0];
  await query(
    "INSERT emprestimos (livro_id, usuario_id, data_emprestimo) VALUES ($1, $2, $3)",
    [livro_id, usuario_id, hoje]
  );
  await query("UPDATE livros SET disponivel = FALSE WHERE id = $1", [
    livro_id,
  ]);
}

export async function registrarDevolucao(livro_id: number) {
  const hoje = new Date().toISOString().split("T")[0];
  await query(
    "UPDATE emprestimos SET data_devolucao = $1 WHERE livro_id = $2 AND data_devolucao IS NULL",
    [hoje, livro_id]
  );
  await query("UPDATE livros SET disponivel = TRUE WHERE id = $1", [
    livro_id,
  ]);
}

export async function listarPorUsuario(usuario_id: number) {
  const res = await query(
    `SELECT * FROM emprestimos WHERE usuario_id = $1 ORDER BY data_emprestimo DESC`,
    [usuario_id]
  );
  return res.rows.map(
    (row) =>
      new Emprestimo(
        row.id,
        row.livro_id,
        row.usuario_id,
        row.data_emprestimo,
        row.data_devolucao
      )
  );
}

export async function calcularMulta(livro_id: number) {
  const res = await query(
    `SELECT data_emprestimo FROM emprestimos WHERE livro_id = $1 AND data_devolucao IS NULL`,
    [livro_id]
  );
  if (res.rows.length === 0) return 0;

  const dataEmprestimo = new Date(res.rows[0].data_emprestimo);
  const hoje = new Date();
  const dias = Math.floor(
    (hoje.getTime() - dataEmprestimo.getTime()) / (1000 * 60 * 60 * 24)
  );
  const limite = 7;
  const multaPorDia = 2;

  return dias > limite ? (dias - limite) * multaPorDia : 0;
}
