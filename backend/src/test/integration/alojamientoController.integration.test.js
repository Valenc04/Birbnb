import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { AlojamientoController } from '../../controllers/AlojamientoController.js';
import { AlojamientoService } from '../../services/AlojamientoService.js';

// mockeo el repo
class MockAlojamientoRepository {
  constructor(data = []) {
    this.data = data;
  }

  async findByMultipleFilters(filters, page = 1, limit = 10) {
    let filtered = [...this.data];

    if (filters['direccion.ciudad.nombre']) {
      filtered = filtered.filter(
        (a) => a.direccion.ciudad.nombre === filters['direccion.ciudad.nombre']
      );
    }

    if (filters.precioPorNoche) {
      const { $gte, $lte } = filters.precioPorNoche;
      filtered = filtered.filter(
        (a) => a.precioPorNoche >= ($gte || 0) && a.precioPorNoche <= ($lte || Infinity)
      );
    }

    // paginación simulada
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);

    return {
      items,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      page,
      limit,
    };
  }
}

// datos de prueba
const TEST_DATA = [
  {
    _id: '1',
    nombre: 'Departamento en Buenos Aires',
    direccion: {
      ciudad: { nombre: 'Buenos Aires', pais: { nombre: 'Argentina' } },
    },
    precioPorNoche: 100,
    caracteristicas: ['WIFI'],
  },
  {
    _id: '2',
    nombre: 'Cabaña en Bariloche',
    direccion: {
      ciudad: { nombre: 'Bariloche', pais: { nombre: 'Argentina' } },
    },
    precioPorNoche: 200,
    caracteristicas: ['WIFI', 'PISCINA'],
  },
];

describe('controller integrado con service y mockeé el repo', () => {
  let app;
  let service;
  let controller;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());

    const mockRepo = new MockAlojamientoRepository(TEST_DATA);
    service = new AlojamientoService(mockRepo);
    controller = new AlojamientoController(service);

    app.get('/alojamientos', (req, res, next) => controller.findByMultipleFilters(req, res, next));
  });

  it('debería filtrar por ciudad correctamente', async () => {
    const response = await request(app)
      .get('/alojamientos')
      .query({ ciudad: 'Buenos Aires' })
      .expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].nombre).toMatch('Buenos Aires');
  });

  it('debería filtrar por precio', async () => {
    const response = await request(app)
      .get('/alojamientos')
      .query({ min: 150, max: 250 })
      .expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].nombre).toMatch('Bariloche');
  });

  it('debería manejar paginación', async () => {
    const response = await request(app).get('/alojamientos').query({ limit: 1 }).expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.totalPages).toBe(2);
  });
});
