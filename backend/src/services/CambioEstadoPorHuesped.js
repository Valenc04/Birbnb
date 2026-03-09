import { ConflictException, CreationException } from '../exceptions/ErroresComunes.js';
import { sePuedeCancelar } from '../utils/sePuedeCancelar.js';
import { esTransicionValida } from '../utils/transicionesCambioEstado.js';
import { CambioEstadoReserva } from '../models/entidades/CambioEstadoReserva.js';
import { EstadoReserva } from '../models/entidades/enums/EstadoReserva.js';
import { factoryNotificacion } from '../models/entidades/factories/FactoryNotificacion.js';

export class CambioEstadoPorHuesped {
  constructor(service) {
    this.service = service;
  }

  async ejecutarCambio(idReserva, cambioEstado) {
    const {
      estado,
      motivo,
      usuario: { idusuario },
    } = cambioEstado;
    const reserva = await this.service.validarReservaYBody(idReserva, cambioEstado);
    const huesped = await this.service.usuarioServicie.buscarUsuarioLogeado(idusuario);
    if (estado === EstadoReserva.CONFIRMADA || estado === EstadoReserva.RECHAZADA) {
      throw new ConflictException(
        `Un huésped no puede cambiar el estado de la reserva a ${estado}. Solo puede cancelar.`
      );
    }
    if (reserva.huespedReservador.email !== huesped.email) {
      throw new ConflictException(`Solo el huésped que reservó puede cancelar`);
    }

    if (!esTransicionValida(reserva.estado, estado)) {
      throw new ConflictException(`No se puede pasar de ${reserva.estado} a ${estado}`);
    }

    if (!sePuedeCancelar(reserva)) {
      throw new ConflictException(`No se puede cancelar, ya comenzó`);
    }

    const cambio = new CambioEstadoReserva({ estado, reserva, usuario: huesped._id, motivo });
    const nuevoEstado = await this.service.cambioDeEstadoMongoRepository.save(cambio);
    if (!nuevoEstado) throw new CreationException('Error guardando el cambio de estado');

    if (estado === EstadoReserva.CANCELADA) {
      const notificacion = factoryNotificacion.cancelarReserva(reserva, motivo);
      await this.service.notificacionServicie.EnviarNotificacionDeLaReserva(notificacion);
    }

    const reservaActualizada = await this.service.reservaRepository.saveUpdate(reserva);
    if (!reservaActualizada) throw new ConflictException('No se pudo actualizar la reserva');
    
    await this.service.alojamientoRepository.removerReserva(reserva.alojamiento.id, idReserva);
    return reservaActualizada;
  }
}
