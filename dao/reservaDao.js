const pool = require("../database/conexao");
const Reserva = require("../models/reserva");

class ReservaDAO {
  static async listarTodos() {
    const res = await pool.query("SELECT * FROM reservas");
    return res.rows.map(
      (r) =>
        new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
    );
  }

  static async criar(reserva) {
    const res = await pool.query(
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

  static async atender(id) {
    await pool.query(`UPDATE reservas SET atendida = true WHERE id = $1`, [id]);
  }

  static async excluir(id) {
    await pool.query(`DELETE FROM reservas WHERE id = $1`, [id]);
  }

  static async listarPorUsuario(usuario_id) {
    const res = await pool.query(
      `SELECT * FROM reservas WHERE usuario_id = $1`,
      [usuario_id]
    );
    return res.rows.map(
      (r) =>
        new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
    );
  }

  static async listarPorLivro(livro_id) {
    const res = await pool.query(`SELECT * FROM reservas WHERE livro_id = $1`, [
      livro_id,
    ]);
    return res.rows.map(
      (r) =>
        new Reserva(r.id, r.livro_id, r.usuario_id, r.data_reserva, r.atendida)
    );
  }
}

module.exports = ReservaDAO;
