import { buildTestServer } from "./utils/server.js";
import { describe, expect, jest, test } from "@jest/globals";
import { ReservaService } from "../../services/ReservaService.js";
import { ReservaController } from "../../controllers/ReservaController.js";
import { AlojamientoMongoRepository } from "../../models/repository/AlojamientoMongoRepository.js";
import { ReservaMongoRepository } from "../../models/repository/ReservaMongoRepository.js";
import { Reserva } from "../../models/entidades/Reserva.js";
import request from "supertest";
import { NotificacionRepositorio } from "../../models/repository/NotificacionRepositorio.js";
import { factoryNotificacion } from "../../models/entidades/factories/FactoryNotificacion.js";

import {UsuarioMongoRepository} from "../../models/repository/UsuarioMongoRepositorio.js"

const server = buildTestServer()

server.configureRoutes()
const notificacionRepositorio = new NotificacionRepositorio()
const alojamientoMongoRepository = new AlojamientoMongoRepository()
const reservaMongoRepository = new ReservaMongoRepository()
const usuarioRepository = new UsuarioMongoRepository()
const reservaService = new ReservaService(reservaMongoRepository, alojamientoMongoRepository, usuarioRepository ,notificacionRepositorio)
const reservaController = new ReservaController(reservaService)

server.setController(ReservaController, reservaController)


describe("POST/reserva ", () => {
  test("debe retornar un 201 y la reserva creada", async () => {
    const newReserva = {
      huespedReservador: {
        id: 1
      },
      cantidadHuespedes: 2,
      alojamiento: {
        id: 1
      },
      rangoFechas: {
        fechaInicio: "2025-05-10",
        fechaFin: "2025-06-07",
      },
      precioNoche: 12,
    };
    const mockAlojamiento = {
      id: 1,
      estasDisponibleEn: jest.fn().mockReturnValue(true),
      puedenAlojarse: jest.fn().mockReturnValue(true),
    };

    const mockHuesped = {
      id: 1,
      nombre: "Juan",
      email: "juan@gmail.com"
    };




    alojamientoMongoRepository.findByName = jest.fn().mockResolvedValue(mockAlojamiento)
    usuarioRepository.findEmail = jest.fn().mockResolvedValue(mockHuesped);
    reservaMongoRepository.save = jest.fn(newReserva)
   
    
    const response = await request(server.app)
      .post("/reserva")
      .send(newReserva)

   expect(response.status).toBe(201)
   expect(alojamientoMongoRepository.findByName).toHaveBeenCalled();
   expect(usuarioRepository.findEmail).toHaveBeenCalled();
   expect(reservaMongoRepository.save).toHaveBeenCalledWith(expect.any(Object))


  })
})