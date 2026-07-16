import { query } from "../database/conexao";
import Usuario from "../models/usuario";
import { hash, compare } from "bcrypt";

export async function registrar(usuario: Usuario) {
  if (!usuario.nome || !usuario.email || !usuario.senha) {
    throw new Error("Dados incompletos para registro de usuário");
  }
  const existe = await query(`SELECT id FROM usuarios WHERE email = $1`, [
    usuario.email,
  ]);
  if (existe.rows.length > 0) {
    throw new Error("E-mail já cadastrado");
  }
  const senhaHash = await hash(usuario.senha, 10);

  const res = await query(
    `INSERT INTO usuarios (nome, email, senha, is_admin) VALUES ($1, $2, $3, $4) RETURNING id`,
    [usuario.nome, usuario.email, senhaHash, usuario.is_admin || false]
  );
  console.log(res);

  return res.rows[0].id;
}

export async function autenticar(email: string, senha: string) {
  const res = await query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
  if (res.rows.length === 0) return null;

  const usuario = res.rows[0];
  const valido = await compare(senha, usuario.senha);

  return valido
    ? {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        is_admin: usuario.is_admin,
      }
    : null;
}

export async function buscarPorId(id: number) {
  const res = await query(`SELECT * FROM usuarios WHERE id = $1`, [id]);
  if (res.rows.length === 0) return null;
  const u = res.rows[0];
  return new Usuario(u.id, u.nome, u.email, u.senha, u.is_admin);
}
