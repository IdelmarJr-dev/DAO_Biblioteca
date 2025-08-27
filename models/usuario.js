/* usuário:id(matrícula) nome, e-mail.
solicitação: matrícula
*/

class usuario {
  constructor(matricula, nome, email, senha) {
    (this.id = matricula),
      (this.nome = nome),
      (this.email = email),
      (this.senha = senha);
  }
}

module.exports = usuario;
