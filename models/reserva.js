class Reserva {
  constructor(id, livro_id, usuario_id, data_reserva, atendida) {
    this.id = id;
    this.livro_id = livro_id;
    this.usuario_id = usuario_id;
    this.data_reserva = data_reserva;
    this.atendida = atendida;
  }
}

module.exports = Reserva;
