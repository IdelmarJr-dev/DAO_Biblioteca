const pool = require("../database/conexao");
const usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

class usuarioDao {
  static async registrar(usuarios) {
    const hash = await bcrypt.hash(usuarios.senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3) RETURNING id"[
        (usuarios.nome, usuarios.email, hash)
      ]
    );
    return result.rows[0].id;
  }
  static async autenticar(email, senha) {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) return null;

    const usuarios = result.rows[0];
    const valido = await bcrypt.compare(senha, usuarios.senha);
    return valido
      ? new usuario(usuarios.id, usuarios.nome, usuarios.email, usuarios.senha)
      : null;
  }
}

module.exports = usuarioDao;
