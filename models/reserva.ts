class Reserva {
  id: number | null;
  livro_id: number;
  usuario_id: number;
  data_reserva: Date | string;
  atendida: boolean;

  constructor(
    id: number | null,
    livro_id: number,
    usuario_id: number,
    data_reserva: Date | string,
    atendida: boolean
  ) {
    this.id = id;
    this.livro_id = livro_id;
    this.usuario_id = usuario_id;
    this.data_reserva = data_reserva;
    this.atendida = atendida;
  }
}

export default Reserva;
