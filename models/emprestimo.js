/// algoritmo de empréstimo: id do livro, do usuário e id do empréstimo, data do empréstimo e data devolução ///

class emprestimo {
    constructor(id_livro, id_usuario, id_emprestimo, dataEmprestimo, dataDevolucao) {
        this.id_livro = id_livro,
        this.id_usuario = id_usuario,
        this.id_emprestimo = id_emprestimo,
        this.dataEmprestimo = dataEmprestimo
        this.dataDevolucao = dataDevolucao
    }
}

module.exports = emprestimo;