import { Reserva } from './../models/entidades/Reserva.js';
import reservaSchema from '../schemas/reservaSchema.js';
import { idSchema } from '../schemas/idSchema.js';
import { factoryNotificacion } from '../models/entidades/factories/FactoryNotificacion.js';
import { paginacionSchema } from '../schemas/paginacionSchema.js';
import validarCambioEstado from '../schemas/cambioEstadoSchema.js';
import { Alojamiento } from '../models/entidades/Alojamiento.js';
import { CambioEstadoPorAnfitrion } from './CambioEstadoPorAnfitrion.js';
import { CambioEstadoPorHuesped } from './CambioEstadoPorHuesped.js';
import { parseZodIssues } from '../utils/parseZodIssues.js';
import {
  NotFoundException,
  ConflictException,
  ValidationException,
  CreationException,
} from '../exceptions/ErroresComunes.js';

export class ReservaService {
  constructor(
    reservaRepo,
    alojamientoServicie,
    alojamientoRepository,
    usuarioServicie,
    notificacionServicie,
    cambioDeEstadoMongoRepository
  ) {
    this.reservaRepository = reservaRepo;
    this.alojamientoServicie = alojamientoServicie;
    this.alojamientoRepository = alojamientoRepository;
    this.usuarioServicie = usuarioServicie;
    this.notificacionServicie = notificacionServicie;
    this.cambioDeEstadoMongoRepository = cambioDeEstadoMongoRepository;
  }
  async disponible({ fechaInicio, fechaFin, cantHuespedes }, idalojamiento) {
    const resultUserId = idSchema.safeParse(idalojamiento);
    const cantidad = Number(cantHuespedes);
    if (!resultUserId.success) {
      const mensajeError = parseZodIssues(resultUserId.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    const rango = {
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    };

    const aloja = await this.alojamientoServicie.buscarAlojamientoActivo(idalojamiento);

    if (!aloja) {
      throw new NotFoundException(`alojamiento con el nombre ${idalojamiento} no encontrado `);
    }

    const alojamiento = new Alojamiento(aloja);

    if (!alojamiento.estasDisponibleEn(rango)) {
      throw new ConflictException(
        `El alojamiento ${idalojamiento}No esta disponible en las fechas seleccionadas`
      );
    }
    if (!alojamiento.puedenAlojarse(cantidad)) {
      throw new ConflictException(
        `El alojamiento no admite esa cantidad de huéspedes , cantidadHuespedesPermitidos ${alojamiento.cantHuespedesMax}`
      );
    }
    return true;
  }

  async create(reserva) {
    const resultBody = reservaSchema.safeParse(reserva);

    if (!resultBody.success) {
      const mensajeError = parseZodIssues(resultBody.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }
    const {
      huespedReservador: { idhuespedReservador },
      alojamiento: { idalojamiento },
      cantHuespedes,
      rangoFechas,
      precioPorNoche,
    } = reserva;

    const rango = {
      fechaInicio: new Date(rangoFechas.fechaInicio),
      fechaFin: new Date(rangoFechas.fechaFin),
    };

    const aloja = await this.alojamientoServicie.buscarAlojamientoActivo(idalojamiento);

    if (!aloja) {
      throw new NotFoundException(`alojamiento con el nombre ${idalojamiento} no encontrado `);
    }
    //TODO no se tiene que instanciar un alojamiento
    const alojamiento = new Alojamiento(aloja);

    if (!alojamiento.estasDisponibleEn(rango)) {
      throw new ConflictException(
        `El alojamiento ${idalojamiento}} No esta disponible en las fechas seleccionadas`
      );
    }
    if (!alojamiento.puedenAlojarse(cantHuespedes)) {
      throw new ConflictException(
        `El alojamiento no admite esa cantidad de huéspedes , cantidadHuespedesPermitidos ${alojamiento.cantHuespedesMax}`
      );
    }

    const huespedReservador = await this.usuarioServicie.buscarUsuarioLogeado(idhuespedReservador);
    if (!huespedReservador) {
      throw new NotFoundException(`El Email ${idhuespedReservador} no se encuentra registrado`);
    }

    const ReservaEntidad = new Reserva({
      huespedReservador: huespedReservador._id,
      cantHuespedes: cantHuespedes,
      alojamiento: aloja._id,
      rangoFechas: rango,
      precioPorNoche,
    });

    const nuevaReserva = await this.reservaRepository.save(ReservaEntidad);
    if (!nuevaReserva) {
      throw new CreationException('No se pudo crear la reserva');
    }

    await this.alojamientoServicie.guardarReservaEnAlojmiento(idalojamiento, nuevaReserva._id);

    const notificacion = factoryNotificacion.crearReserva(nuevaReserva);

    const notifiacionActualizada =
      await this.notificacionServicie.EnviarNotificacionDeLaReserva(notificacion);

    if (!notifiacionActualizada) {
      throw new ConflictException('No se pudo actualizar la notificacion');
    }

    return this.toDTO(nuevaReserva);
  }

  async postCambioEstado(idReserva, cambioEstado) {
    const { idusuario } = cambioEstado.usuario;

    const usuario = await this.usuarioServicie.buscarUsuarioLogeado(idusuario);
    if (!usuario) {
      throw new NotFoundException(`Usuario no encontrado: ${idusuario}`);
    }

    let handler;
    if (usuario.tipo === 'HUESPED') {
      handler = new CambioEstadoPorHuesped(this);
    } else if (usuario.tipo === 'ANFITRION') {
      handler = new CambioEstadoPorAnfitrion(this);
    } else {
      throw new ValidationException(`Tipo de usuario no válido: ${usuario.tipo}`);
    }

    const reservaActualizada = await handler.ejecutarCambio(idReserva, cambioEstado);

     if (reservaActualizada?.removida) {
    return reservaActualizada;
  }

    return this.toDTO(reservaActualizada);
  }

  async validarReservaYBody(idReserva, cambioEstado) {
    const resultUserId = idSchema.safeParse(idReserva);
    if (!resultUserId.success) {
      throw new ValidationException(`Error en ID: ${parseZodIssues(resultUserId.error.issues)}`);
    }

    const reserva = await this.reservaRepository.findById(idReserva);
    if (!reserva) {
      throw new NotFoundException(`Reserva no encontrada: ${idReserva}`);
    }

    const resultBody = validarCambioEstado.safeParse(cambioEstado);
    if (!resultBody.success) {
      throw new ValidationException(`Error en body: ${parseZodIssues(resultBody.error.issues)}`);
    }

    return reserva;
  }



  async findById(id) {
    let reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva no encontrada: ${JSON.stringify(reserva)}`);
    }

    return this.toDTO(reserva);
  }

  async findAllByUserId(userId, { page = 1, limit = 10 }) {
    const resultUserId = idSchema.safeParse(userId);
    if (!resultUserId.success) {
      const mensajeError = parseZodIssues(resultUserId.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    page = Number(page);
    limit = Number(limit);
    const resultPage = paginacionSchema.safeParse({ page: page, limit: limit });
    if (!resultPage.success) {
      const mensajeError = parseZodIssues(resultPage.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    let reservas = await this.reservaRepository.findAllByUserId(userId, {
      page: page,
      limit: limit,
    });
    if (!reservas) {
      throw new NotFoundException(
        'No se encontraron reservas para el usuario con ID: ' + userId + ''
      );
    }

    const total = await this.reservaRepository.countAllByUserId(userId);
    const total_pages = Math.ceil(total / limit);

    const data = reservas.map((r) => this.toDTO(r));

    return {
      page: page,
      limit: limit,
      total: total,
      total_pages: total_pages,
      data: data,
    };
  }

  async findAllByAnfitrionId(userId, { page = 1, limit = 10 }) {
    // Validación del ID del usuario
    const resultUserId = idSchema.safeParse(userId);
    if (!resultUserId.success) {
      const mensajeError = parseZodIssues(resultUserId.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    // Conversión a número
    page = Number(page);
    limit = Number(limit);

    // Validación de parámetros de paginación
    const resultPage = paginacionSchema.safeParse({ page, limit });
    if (!resultPage.success) {
      const mensajeError = parseZodIssues(resultPage.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    // Traer todos los alojamientos del anfitrión
    const alojamientos = await this.alojamientoRepository.findAllByAnfitrionId(userId, {});
    const idReservas = alojamientos.flatMap((alojamiento) => alojamiento.reservas || []);
      if (idReservas.length === 0) {
    // No hay reservas, devolver vacío
    return { data: [], total_pages: 0 };
  }

    // Buscar todas las reservas correspondientes
    const reservasPromises = idReservas.map(idReserva =>
      this.reservaRepository.findById(idReserva)
    );
    const reservas = await Promise.all(reservasPromises);

    if (!reservas || reservas.length === 0) {
      throw new NotFoundException(
        `No se encontraron reservas para el usuario con ID: ${userId}`
      );
    }

    // Filtrar las reservas no nulas
    const reservasValidas = reservas.filter(r => r !== null);

    // Cálculo de paginación
    const total = reservasValidas.length;
    const total_pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedReservas = reservasValidas.slice(offset, offset + limit);

    // Convertir a DTO
    const data = paginatedReservas.map((r) => this.toDTO(r));

    // Retornar resultado paginado
    return {
      page,
      limit,
      total,
      total_pages,
      data,
    };
  }


  async update(id, { rangoFechas, cantHuespedes }) {
    const resultUserId = idSchema.safeParse(id);
    if (!resultUserId.success) {
      const mensajeError = parseZodIssues(resultUserId.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    if (!rangoFechas && !cantHuespedes) {
      throw new ValidationException('No se envio ningun parametro para modificar');
    }

    const updateReservaSchema = reservaSchema
      .pick({ cantidadHuespedes: true, rangoFechas: true })
      .partial();
    const resultBody = updateReservaSchema.safeParse({
      rangoFechas,
      cantHuespedes,
    });

    if (!resultBody.success) {
      const mensajeError = parseZodIssues(resultBody.error.issues);
      throw new ValidationException(`Error en la validacion: ${mensajeError}`);
    }

    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva no encontrada: ${JSON.stringify(reserva)}`);
    }

    let alojamiento = await this.alojamientoServicie.buscarAlojamientoActivo(reserva.alojamiento);
    if (!alojamiento) {
      throw new NotFoundException(
        'No se encontró el alojamiento con ID: ' + reserva.alojamientoId + ''
      );
    }
    alojamiento = new Alojamiento(alojamiento);

    if (rangoFechas) {
      if (!alojamiento.estasDisponibleEn(rangoFechas)) {
        throw new ConflictException('No está disponible en las fechas seleccionadas');
      } else {
        reserva.rangoFechas = rangoFechas;
      }
    }

    if (cantHuespedes) {
      if (!alojamiento.puedenAlojarse(cantHuespedes)) {
        throw new ConflictException('La cantidad de huéspedes excede la capacidad');
      } else {
        reserva.cantHuespedes = cantHuespedes;
      }
    }

    const reservaActualizada = await this.reservaRepository.saveUpdate(reserva);
    if (!reservaActualizada) {
      throw new ConflictException('No se pudo actualizar la reserva');
    }

    return this.toDTO(reservaActualizada);
  }

  toDTO(reserva) {
    return {
      reservaId: reserva.id,
      alojamientoId: reserva.alojamiento?.id,
      huespedReservadorId: reserva.huespedReservador?.id,
      estado: reserva.estado,
      fechaAlta: reserva.fechaAlta,
      cantidadHuespedes: reserva.cantHuespedes,
      rangoFechas: {
        fechaInicio: reserva.rangoFechas?.fechaInicio,
        fechaFin: reserva.rangoFechas?.fechaFin,
      },
      precioNoche: reserva.precioPorNoche,
    };
  }

}
