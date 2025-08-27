/// modelo de biblioteca: id, título, autor, ano de publicação e se está disponível. ///

class livro {
    constructor(id_livro, titulo, autor, ano_de_publicacao, disponibilidade = true) {
        this.id = id_livro,
        this.titulo = titulo,
        this.autor = autor,
        this.ano_de_publicacao = ano_de_publicacao,
        this.disponibilidade = disponibilidade
    }
     
}

module.exports = livro;

