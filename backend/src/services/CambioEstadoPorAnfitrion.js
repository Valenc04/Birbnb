import { ConflictException, CreationException } from '../exceptions/ErroresComunes.js';

import { esTransicionValida } from '../utils/transicionesCambioEstado.js';
import { CambioEstadoReserva } from '../models/entidades/CambioEstadoReserva.js';
import { EstadoReserva } from '../models/entidades/enums/EstadoReserva.js';
import { factoryNotificacion } from '../models/entidades/factories/FactoryNotificacion.js';

export class CambioEstadoPorAnfitrion {
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
    const anfitrion = await this.service.usuarioServicie.buscarUsuarioLogeado(idusuario);

    if (idusuario !== anfitrion.email) {
      throw new ConflictException(`Solo el anfitrión puede confirmar o rechazar`);
    }

    if (!esTransicionValida(reserva.estado, estado)) {
      throw new ConflictException(`No se puede pasar de ${reserva.estado} a ${estado}`);
    }

    const cambio = new CambioEstadoReserva({ estado, reserva, usuario: anfitrion._id, motivo });
    const nuevoEstado = await this.service.cambioDeEstadoMongoRepository.save(cambio);
    if (!nuevoEstado) throw new CreationException('Error guardando el cambio de estado');

    if (estado === EstadoReserva.CONFIRMADA) {
      const notificacion = factoryNotificacion.confirmarReserva(reserva);
      await this.service.notificacionServicie.EnviarNotificacionDeLaReserva(notificacion);

      const reservaActualizada = await this.service.reservaRepository.saveUpdate(reserva);
      if (!reservaActualizada) throw new ConflictException('No se pudo actualizar la reserva');

      return reservaActualizada;
    }
    if (estado === EstadoReserva.RECHAZADA) {
      const notificacion = factoryNotificacion.rechazarReserva(reserva, motivo);
      await this.service.notificacionServicie.EnviarNotificacionDeLaReserva(notificacion);

      const reservaActualizada = await this.service.reservaRepository.saveUpdate(reserva);

      if (!reservaActualizada) throw new ConflictException('No se pudo actualizar la reserva');

      await this.service.alojamientoRepository.removerReserva(reserva.alojamiento.id, idReserva);

      return reservaActualizada;
    }
  }
}
