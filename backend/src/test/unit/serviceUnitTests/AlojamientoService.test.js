import {AlojamientoService} from '../../../services/AlojamientoService.js';

import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {Moneda} from "../../../models/entidades/enums/Moneda.js";

describe('AlojamientoService', () => {
    let alojamientoRepositorioMock;
    let alojamientoService;

    beforeEach(() => {
        alojamientoRepositorioMock = {
            findByName: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findByRangoPrecio: jest.fn(),
            findByCantidadHuespedes: jest.fn(),
            findByCaracteristicas: jest.fn(),
            findByUbicacion: jest.fn(),
        };
        alojamientoService = new AlojamientoService(alojamientoRepositorioMock);
    })

    it('Debería crear un nuevo alojamiento con éxito', async () => {
        const validAlojamientoData = {
            nombre: 'Alojamiento Test',
            precioPorNoche: 100,
            anfitrion: 'Anfitrión Test',
            moneda: Moneda.DOLAR_USA,
            cantHuespedesMax: 4,
            direccion: {
                ciudad: {nombre: 'Buenos Aires', pais: {nombre: 'Argentina'}},
            },
        }

        alojamientoRepositorioMock.findByName.mockResolvedValue(null)
        alojamientoRepositorioMock.create.mockResolvedValue({_id: '1', ...validAlojamientoData})

        const result = await alojamientoService.create(validAlojamientoData)

        expect(result).toMatchObject({
            id: '1',
            nombre: 'Alojamiento Test',
            precioPorNoche: 100,
            moneda: Moneda.DOLAR_USA,
        });
        expect(alojamientoRepositorioMock.findByName).toHaveBeenCalledWith(validAlojamientoData.nombre)
        expect(alojamientoRepositorioMock.create).toHaveBeenCalled()
    })

    it('Debería lanzar un error si el alojamiento ya existe', async () => {
        const alojamientoData = {
            nombre: 'Alojamiento Existente',
            precioPorNoche: 150,
            anfitrion: 'Anfitrión Test',
            moneda: Moneda.DOLAR_USA,
            cantHuespedesMax: 2,
            direccion: {
                ciudad: {nombre: 'Barcelona', pais: {nombre: 'España'}},
            },
        }

        alojamientoRepositorioMock.findByName.mockResolvedValue(alojamientoData)

        await expect(alojamientoService.create(alojamientoData)).rejects.toThrow(
            `Ya existe un alojamiento con el nombre ${alojamientoData.nombre}`
        )
    })

    it('Debería encontrar todos los alojamientos con paginación.', async () => {
        const paginationResult = {
            total: 1,
            items: [{_id: '1', nombre: 'Alojamiento'}],
        }

        alojamientoRepositorioMock.findAll.mockResolvedValue(paginationResult)

        const result = await alojamientoService.findAll(1, 10)

        expect(result.items).toHaveLength(1)
        expect(result.items[0]).toMatchObject({id: '1', nombre: 'Alojamiento'})
        expect(alojamientoRepositorioMock.findAll).toHaveBeenCalledWith(1, 10)
    });

    it('Debería generar un error si no se encuentran alojamientos por rango de precio', async () => {
        alojamientoRepositorioMock.findByRangoPrecio.mockResolvedValue({items: []})

        await expect(alojamientoService.findByRangoPrecio(50, 100)).rejects.toThrow(
            'No se encontraron alojamientos en el rango de precio especificado'
        )
    })

    it('Debería generar un error para un recuento de invitados no válido.', async () => {
        await expect(alojamientoService.findByCantidadHuespedes('invalid')).rejects.toThrow(
            'La cantidad de huéspedes debe ser un número'
        )

        await expect(alojamientoService.findByCantidadHuespedes(0)).rejects.toThrow(
            'La cantidad de huéspedes debe ser al menos 1'
        )
    })

    it('Debería lanzar un error si no se encuentran alojamientos con las características dadas', async () => {
        alojamientoRepositorioMock.findByCaracteristicas.mockResolvedValue({items: []})

        await expect(
            alojamientoService.findByCaracteristicas(['WIFI'])
        ).rejects.toThrow('No se encontraron alojamientos con las características: WIFI')
    })

    it('Deberías buscar alojamientos por ubicación', async () => {
        const ubicacionResult = {
            items: [{_id: '1', nombre: 'Alojamiento en Madrid'}],
        }

        alojamientoRepositorioMock.findByUbicacion.mockResolvedValue(ubicacionResult)

        const result = await alojamientoService.findByUbicacion('Madrid', 'España')

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toMatchObject({id: '1', nombre: 'Alojamiento en Madrid'})
        expect(alojamientoRepositorioMock.findByUbicacion).toHaveBeenCalledWith(
            'Madrid',
            'España',
            1,
            10
        )
    })
})