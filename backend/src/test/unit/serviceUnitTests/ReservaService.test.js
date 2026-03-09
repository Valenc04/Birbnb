// ReservaService.test.js

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {NotFoundException , ConflictException, ValidationException} from "../../../exceptions/ErroresComunes.js"
import { ReservaService } from "../../../services/ReservaService.js";
import { factoryNotificacion } from "../../../models/entidades/factories/FactoryNotificacion.js";

const mockReservaRepository = {
  findById: jest.fn(),
  update: jest.fn(),
  findAllByUserId: jest.fn(), // Añadido
  countAllByUserId: jest.fn(), // Añadido
  save: jest.fn(),
  saveUpdate: jest.fn(),
};
const mockAlojamientoRepository = {
  findById: jest.fn(),
  findByName: jest.fn()
};

const mockUsuarioRepository = {
  findEmail: jest.fn(),
};
const mockNotificacionRepository = {
  save: jest.fn(),
}


describe('ReservaService - update method', () => {
  let reservaService

  beforeEach(() => {
    reservaService = new ReservaService(
      mockReservaRepository,
      mockAlojamientoRepository,
      mockUsuarioRepository,
      mockNotificacionRepository
    );
  });

  it('Debería cambiar el estado de la reserva a CANCELADA y guardar notificación', async () => {
  const fechaFutura = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  const mockReserva = {
    rangoFechas: { fechaInicio: fechaFutura },
    estado: 'PENDIENTE',
    _actualizarEstado: function (nuevoEstado) {
      this.estado = nuevoEstado
    },
    huespedReservador: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      tipo: 'HUESPED',
    },
  }

  // Mockear como spy para que no pierda la implementación
  jest.spyOn(mockReserva, '_actualizarEstado');

  mockReservaRepository.findById.mockResolvedValue(mockReserva)
  mockReservaRepository.saveUpdate = jest.fn().mockResolvedValue(mockReserva)
  mockNotificacionRepository.save = jest.fn()

  factoryNotificacion.cancelarReserva = jest.fn().mockReturnValue({ id: 'notif-123' })

  const cambioEstadoReserva = {
    fecha: new Date(),
    estado: 'CANCELADA',
    motivo: '',
    usuario: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      tipo: 'HUESPED',
    },
  }

  const result = await reservaService.post('id-valido', cambioEstadoReserva)

  expect(factoryNotificacion.cancelarReserva).toHaveBeenCalled()
  expect(mockNotificacionRepository.save).toHaveBeenCalled()
  expect(mockReservaRepository.saveUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      estado: 'CANCELADA'
    })
  )
  expect(result).toBeDefined()
})


})


describe("ReservaService - create method", () => {

  let reservaService;

  beforeEach(() => {
    reservaService = new ReservaService(
      mockReservaRepository,
      mockAlojamientoRepository,
      mockUsuarioRepository,
      mockNotificacionRepository,

    );
  });


  it('debería crear una reserva si los datos son válidos', async () => {
    const mockReserva = {
      huespedReservador: { idhuespedReservador: 1 },
      cantHuespedes: 1,
      alojamiento: { idalojamiento: 1 },
      rangoFechas: { fechaInicio: '2025-05-10', fechaFin: '2025-06-07' },
      precioPorNoche: 12,
      fechaAlta: new Date().toISOString(),
      estado: 'PENDIENTE',
    };

    const mockAlojamiento = {
      _id: 1,
      estasDisponibleEn: jest.fn().mockReturnValue(true),
      puedenAlojarse: jest.fn().mockReturnValue(true),
    };

    const mockHuesped = {
      _id: 1,
      nombre: 'Juan',
      email: "juan@gmail.com",
    };

    mockAlojamientoRepository.findByName.mockResolvedValue(mockAlojamiento);
    mockUsuarioRepository.findEmail.mockResolvedValue(mockHuesped);
    mockReservaRepository.save.mockResolvedValue(mockReserva);
    mockNotificacionRepository.save.mockResolvedValue({ id: 'notif-123' });
    factoryNotificacion.crearReserva = jest.fn().mockReturnValue({ id: 'notif-123' });

    const result = await reservaService.create(mockReserva);

    expect(mockAlojamientoRepository.findByName).toHaveBeenCalledWith(1);
    expect(mockUsuarioRepository.findEmail).toHaveBeenCalledWith(1);
    expect(mockReservaRepository.save).toHaveBeenCalledWith(expect.anything());
    expect(mockNotificacionRepository.save).toHaveBeenCalled();
    expect(factoryNotificacion.crearReserva).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual(reservaService.toDTO(mockReserva));
  });



  it('debería lanzar ReservaValidationError si la reserva es inválida', async () => {
    const reservaInvalida = {

      huespedReservador: { id: 1 },
      alojamiento: { id: 2 },
      rangoFechas: { fechaInicio: '2024-05-01', fechaFin: '2024-05-10' },
    };

    await expect(reservaService.create(reservaInvalida))
      .rejects
      .toThrow(ValidationException);
  })
  it('debería lanzar ReservaNotFound si el usuario reservador no existe', async () => {
    const mockReserva = {
      huespedReservador: { idhuespedReservador: 1 },
      cantHuespedes: 1,
      alojamiento: { idalojamiento: 1 },
      rangoFechas: { fechaInicio: '2025-05-10', fechaFin: '2025-06-07' },
      precioPorNoche: 12,
      fechaAlta: new Date().toISOString(),
      estado: 'PENDIENTE',
    };


    mockAlojamientoRepository.findByName.mockResolvedValue({
      estasDisponibleEn: jest.fn().mockReturnValue(true),
      puedenAlojarse: jest.fn().mockReturnValue(true),
    })


    mockUsuarioRepository.findEmail.mockResolvedValue(null);

    await expect(reservaService.create(mockReserva))
        .rejects
        .toThrow(NotFoundException);
  })
  /////
  it('debería lanzar ReservaNotFound si el alojamiento no existe', async () => {
    const mockReserva = {
      huespedReservador: {idhuespedReservador: 1},
      cantHuespedes: 1,
      alojamiento: {idalojamiento: 1},
      rangoFechas: {fechaInicio: '2025-05-10', fechaFin: '2025-06-07'},
      precioPorNoche: 12,
      fechaAlta: new Date().toISOString(),
      estado: 'PENDIENTE',
    };

    mockAlojamientoRepository.findByName.mockResolvedValue(null);

    await expect(reservaService.create(mockReserva))
        .rejects
        .toThrow(NotFoundException);
  });
  it('No debería lanzar ReservaValidationError si los datos son válidos según el esquema Zod', async () => {
    const mockReserva = {
      rangoFechas: {fechaInicio: new Date(Date.now() + 86400000).toISOString()},
      estado: 'PENDIENTE',
      _actualizarEstado: jest.fn(),
        huespedReservador: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      },
    };

    mockReservaRepository.findById.mockResolvedValue(mockReserva);

    const cambioEstadoReserva = {
      estado: 'CANCELADA',
      motivo: 'No puedo viajar',
      fecha: new Date(),
      usuario: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      }
    };

    await expect(reservaService.post('id-valido', cambioEstadoReserva))
        .resolves.not.toThrow();
  });

  it('Debería lanzar ReservaConflict si la fecha actual es posterior a la fecha de inicio', async () => {
    const fechaPasada = new Date(Date.now() - 86400000).toISOString(); // ayer

    const mockReserva = {
      rangoFechas: {fechaInicio: fechaPasada},
      estado: 'PENDIENTE',
      _actualizarEstado: jest.fn(),
        huespedReservador: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      },
    };

    mockReservaRepository.findById.mockResolvedValue(mockReserva);

    const cambioEstadoReserva = {
      estado: 'CANCELADA',
      motivo: 'No puedo viajar',
      fecha: new Date(), // 
      usuario: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      }
    };

    await expect(reservaService.post('id-valido', cambioEstadoReserva))
        .rejects.toThrow(ConflictException);
  });

  it('Debería lanzar ReservaConflict si el estado es igual al actual', async () => {
    const fechaFutura = new Date(Date.now() + 86400000).toISOString();

    const mockReserva = {
      rangoFechas: {fechaInicio: fechaFutura},
      estado: 'CANCELADA',
      _actualizarEstado: jest.fn(),
        huespedReservador: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      },
    };

    mockReservaRepository.findById.mockResolvedValue(mockReserva);

    const cambioEstadoReserva = {
      estado: 'CANCELADA',
      motivo: 'No puedo viajar',
      fecha: new Date(), // 
      usuario: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        tipo: 'HUESPED',
      }
    };

    await expect(reservaService.post('id-valido', cambioEstadoReserva))
        .rejects.toThrow(ConflictException);
  });
  it('Debería guardar una notificación al crear una reserva', async () => {
    const toSimpleDate = (date) => date.toISOString().split('T')[0];

const mockReserva = {
  huespedReservador: { idhuespedReservador: 'juan@example.com' },
  cantHuespedes: 1,
  alojamiento: { idalojamiento: 'Casa de playa' },
  rangoFechas: {
    fechaInicio: toSimpleDate(new Date(Date.now() + 86400000)),
    fechaFin: toSimpleDate(new Date(Date.now() + 86400000 * 2)),
  },
  precioPorNoche: 100,
  fechaAlta: new Date().toISOString(),
  estado: 'PENDIENTE',
};

    const mockAlojamiento = {
      _id: 'aloja123',
      estasDisponibleEn: jest.fn().mockReturnValue(true),
      puedenAlojarse: jest.fn().mockReturnValue(true),
    };

    const mockUsuario = {_id: 'usuario123'};

    const mockReservaGuardada = {
      _id: 'reserva123',
      cantHuespedes: 1,
      precioPorNoche: 100,
      fechaAlta: new Date().toISOString(),
      estado: 'PENDIENTE',
      rangoFechas: {
        fechaInicio: new Date(Date.now() + 86400000).toISOString(),
        fechaFin: new Date(Date.now() + 86400000 * 2).toISOString(),
      },
      huespedReservador: {_id: 'usuario123'},
      alojamiento: {_id: 'aloja123'},
    };

    const mockNotificacion = {mensaje: 'Reserva creada'};

    mockAlojamientoRepository.findByName.mockResolvedValue(mockAlojamiento);
    mockUsuarioRepository.findEmail.mockResolvedValue(mockUsuario);
    mockReservaRepository.save.mockResolvedValue(mockReservaGuardada);
    mockNotificacionRepository.save = jest.fn().mockResolvedValue(mockNotificacion);
    jest.spyOn(factoryNotificacion, 'crearReserva').mockReturnValue(mockNotificacion);

    await reservaService.create(mockReserva);

    expect(factoryNotificacion.crearReserva).toHaveBeenCalledWith(mockReservaGuardada);
    expect(mockNotificacionRepository.save).toHaveBeenCalledWith(mockNotificacion);
  });
})

describe('ReservaService - findAllByUserId method', () => {
  let reservaService;

  beforeEach(() => {
    reservaService = new ReservaService(
        mockReservaRepository,
        mockAlojamientoRepository,
        mockUsuarioRepository
    )
  })

  it('Debe devolver las reservas si se proporciona una identificación de usuario válida', async () => {
    const mockUserId = "1";
    const paginacion = { page: 1, limit: 2 }

    const mockReservas = [
      {
        id: "1",
        alojamiento: { id: 10 },
        huespedReservador: { id: 1 },
        cantidadHuespedes: 2,
        rangoFechas: { fechaInicio: '2024-01-01', fechaFin: '2024-01-05' },
        precioPorNoche: 100
      },
      {
        id: "2",
        alojamiento: { id: 11 },
        huespedReservador: { id: 1 },
        cantidadHuespedes: 3,
        rangoFechas: { fechaInicio: '2024-02-01', fechaFin: '2024-02-05' },
        precioPorNoche: 150
      },
    ];

    mockReservaRepository.findAllByUserId.mockResolvedValue(mockReservas)
    mockReservaRepository.countAllByUserId.mockResolvedValue(10)

    const result = await reservaService.findAllByUserId(mockUserId, paginacion)

    expect(mockReservaRepository.findAllByUserId).toHaveBeenCalledWith(mockUserId, paginacion)
    expect(mockReservaRepository.countAllByUserId).toHaveBeenCalledWith(mockUserId)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(2)
    expect(result.total).toBe(10)
    expect(result.total_pages).toBe(5)
    expect(result.data).toEqual(mockReservas.map(reserva => reservaService.toDTO(reserva)))
  });

})