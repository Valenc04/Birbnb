export class CambioEstadoReserva {
    fecha          // Date
    estado         // EstadoReserva
    reserva        // Reserva
    motivo         // String
    usuario        // Usuario

    constructor({ estado, reserva, motivo, usuario }) {
        this.fecha     = new Date()
        this.estado    = estado
        this.reserva   = reserva
        this.motivo    = motivo
        this.usuario   = usuario
        reserva._actualizarEstado(estado, motivo)
    }

 
}