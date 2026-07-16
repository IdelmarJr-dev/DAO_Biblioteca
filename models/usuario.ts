/* usuário:id(matrícula) nome, e-mail.
solicitação: matrícula
*/

class Usuario {
  id: number | null;
  nome: string;
  email: string;
  senha: string;
  is_admin: boolean;

  constructor(
    matricula: number | null,
    nome: string,
    email: string,
    senha: string,
    is_admin = false
  ) {
    this.id = matricula;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.is_admin = is_admin;
  }
}

export default Usuario;
