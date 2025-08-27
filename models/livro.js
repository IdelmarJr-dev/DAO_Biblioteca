/// modelo de biblioteca: id, título, autor, ano de publicação e se está disponível. ///

class livro {
  constructor(id_livro, titulo, autor, ano, disponibilidade = true) {
    (this.id = id_livro),
      (this.titulo = titulo),
      (this.autor = autor),
      (this.ano = ano),
      (this.disponibilidade = disponibilidade);
  }
}

module.exports = livro;
