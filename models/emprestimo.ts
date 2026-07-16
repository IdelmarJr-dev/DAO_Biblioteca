/// algoritmo de empréstimo: id do livro, do usuário e id do empréstimo, data do empréstimo e data devolução ///

class Emprestimo {
  id_livro: number;
  id_usuario: number;
  id_emprestimo: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;

  constructor(
    id_livro: number,
    id_usuario: number,
    id_emprestimo: number,
    dataEmprestimo: string,
    dataDevolucao: string | null
  ) {
    this.id_livro = id_livro;
    this.id_usuario = id_usuario;
    this.id_emprestimo = id_emprestimo;
    this.dataEmprestimo = dataEmprestimo;
    this.dataDevolucao = dataDevolucao;
  }
}

export default Emprestimo;
