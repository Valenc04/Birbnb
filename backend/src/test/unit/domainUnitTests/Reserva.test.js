import {Reserva} from '../../../models/entidades/Reserva.js';
import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {EstadoReserva} from "../../../models/entidades/enums/EstadoReserva.js";
import {RangoFechas} from "../../../models/entidades/RangoFechas.js";
import {factoryNotificacion} from "../../../models/entidades/factories/FactoryNotificacion.js";


describe('Reserva Class', () => {
    let mockRangoFechas, mockAlojamiento

    beforeEach(() => {
        mockRangoFechas = {
            seSolapaCon: jest.fn(),
        }
        mockAlojamiento = {}
    })

    test('Debería generar un error si el nuevo estado es el mismo que el estado actual', () => {
        const reserva = new Reserva({
            huespedReservador: 'John Doe',
            cantHuespedes: 2,
            alojamiento: mockAlojamiento,
            rangoFechas: mockRangoFechas,
            precioPorNoche: 100,
        })

        expect(() => reserva._actualizarEstado(EstadoReserva.PENDIENTE)).toThrow(
            'La reserva ya tenía ese estado'
        )
    })


    test('Debería actualizar el estado y activar la notificación de confirmarReserva', () => {
        const reserva = new Reserva({
            huespedReservador: 'John Doe',
            cantHuespedes: 2,
            alojamiento: mockAlojamiento,
            rangoFechas: mockRangoFechas,
            precioPorNoche: 100,
        })

        reserva._actualizarEstado(EstadoReserva.CONFIRMADA);

        expect(reserva.estado).toBe(EstadoReserva.CONFIRMADA);
    })
   

    test('Debería devolver true si los rangos se solapan', () => {
        const rangoReserva = new RangoFechas(
            new Date('2025-05-10'),
            new Date('2025-05-20')
        )
        const reserva = new Reserva({
            huespedReservador: 'Alice',
            cantHuespedes: 2,
            alojamiento: {},
            rangoFechas: rangoReserva,
            precioPorNoche: 100,
        })

        const rangoChequeo = new RangoFechas(
            new Date('2025-05-15'),
            new Date('2025-05-25')
        )

        expect(reserva.ocupaElRango(rangoChequeo)).toBe(true)
    })
    test('Debería devolver false si los rangos no se solapan', () => {
        const rangoReserva = new RangoFechas(
            new Date('2025-05-10'),
            new Date('2025-05-20')
        )
        const reserva = new Reserva({
            huespedReservador: 'Alice',
            cantHuespedes: 2,
            alojamiento: {},
            rangoFechas: rangoReserva,
            precioPorNoche: 100,
        })
        const rangoChequeo = new RangoFechas(
            new Date('2025-05-21'),
            new Date('2025-05-25')
        )   
    
    expect(reserva.ocupaElRango(rangoChequeo)).toBe(false)

})
})