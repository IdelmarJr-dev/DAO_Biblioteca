/// modelo do bibliotecário ///

class Bibliotecario {
  id_funcionario: number | null;
  idade: number;
  email: string;
  senha: string;

  constructor(
    id_funcionario: number | null,
    idade: number,
    email: string,
    senha: string
  ) {
    this.id_funcionario = id_funcionario;
    this.idade = idade;
    this.email = email;
    this.senha = senha;
  }
}

export default Bibliotecario;
