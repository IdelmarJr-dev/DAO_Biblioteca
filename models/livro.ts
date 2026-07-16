/// modelo de biblioteca: id, título, autor, ano de publicação e se está disponível. ///

class Livro {
  id: number | null;
  titulo: string;
  autor: string;
  ano: number;
  disponibilidade: boolean;

  constructor(
    id_livro: number | null,
    titulo: string,
    autor: string,
    ano: number,
    disponibilidade = true
  ) {
    this.id = id_livro;
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
    this.disponibilidade = disponibilidade;
  }
}

export default Livro;
