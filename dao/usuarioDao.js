const pool = require("../database/conexao");
const usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

class usuarioDao {
  static async registrar(usuario) {
    // 🔍 Validação básica
    if (!usuario.nome || !usuario.email || !usuario.senha) {
      throw new Error("Dados incompletos para registro de usuário");
    }
    const existe = await pool.query(
      `SELECT id FROM usuarios WHERE email = $1`,
      [usuario.email]
    );
    if (existe.rows.length > 0) {
      throw new Error("E-mail já cadastrado");
    }
    const hash = await bcrypt.hash(usuario.senha, 10);

    const res = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, is_admin) VALUES ($1, $2, $3, $4) RETURNING id`,
      [usuario.nome, usuario.email, hash, usuario.is_admin || false]
    );

    return res.rows[0].id;
  }

  static async autenticar(email, senha) {
    const res = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [
      email,
    ]);
    if (res.rows.length === 0) return null;

    const usuario = res.rows[0];
    const valido = await bcrypt.compare(senha, usuario.senha);
    return valido
      ? new usuario(
          usuario.id,
          usuario.nome,
          usuario.email,
          usuario.senha,
          usuario.is_admin
        )
      : null;
  }

  static async buscarPorId(id) {
    const res = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
    if (res.rows.length === 0) return null;
    const u = res.rows[0];
    return new usuario(u.id, u.nome, u.email, u.senha, u.is_admin);
  }
}

module.exports = usuarioDao;
