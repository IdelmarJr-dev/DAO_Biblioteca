import { query } from "../database/conexao";
import Reserva from "../models/reserva";

export async function listarTodos() {
  const res = await query("SELECT * FROM reservas");
  return res.rows.map(
    (r) =>
      new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
  );
}

export async function criar(reserva: Reserva) {
  const res = await query(
    `INSERT INTO reservas (livro_id, usuario_id, data_reserva, atendida)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [
      reserva.livro_id,
      reserva.usuario_id,
      reserva.data_reserva,
      reserva.atendida || false,
    ]
  );
  return res.rows[0].id;
}

export async function atender(id: number) {
  await query(`UPDATE reservas SET atendida = true WHERE id = $1`, [id]);
}

export async function excluir(id: number) {
  await query(`DELETE FROM reservas WHERE id = $1`, [id]);
}

export async function listarPorUsuario(usuario_id: number) {
  const res = await query(`SELECT * FROM reservas WHERE usuario_id = $1`, [
    usuario_id,
  ]);
  return res.rows.map(
    (r) =>
      new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
  );
}

export async function listarPorLivro(livro_id: number) {
  const res = await query(`SELECT * FROM reservas WHERE livro_id = $1`, [
    livro_id,
  ]);
  return res.rows.map(
    (r) =>
      new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
  );
}
