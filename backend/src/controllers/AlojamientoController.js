import { RangoFechas } from '../models/entidades/RangoFechas.js';

export class AlojamientoController {
  constructor(alojamientoService) {
    this.alojamientoService = alojamientoService;
  }

  async findAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.alojamientoService.findAll(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const result = await this.alojamientoService.findById(req.params.id);
      res.status(200).json(result);
    }
    catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const alojamiento = await this.alojamientoService.create(req.body);
      res.status(201).json(alojamiento);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.alojamientoService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
    async findByReservasOcupadas(req,res,next){
       try {
      const reservasOcupadas = await this.alojamientoService.ReservasOcupadas(req.params.id);
      res.status(200).json(reservasOcupadas);
    } catch (error) {
      next(error);
    }
  }

  async findByMultipleFilters(req, res, next) {
    try {
      const {
        cantidad, 
        min, 
        max, 
        caracteristicas, 
        ciudad, 
        pais,
        rangoFechas,
        page = 1,
        limit = 10
      } = req.query;
      
      const filters = {};
      
      if (cantidad) {
        filters.cantHuespedesMax = { $gte: parseInt(cantidad) };
      }
      
      if (min && max) {
        filters.precioPorNoche = { $gte: parseFloat(min), $lte: parseFloat(max) };
      } else if (min) {
        filters.precioPorNoche = { $gte: parseFloat(min) };
      } else if (max) {
        filters.precioPorNoche = { $lte: parseFloat(max) };
      }
      
      if (caracteristicas) {
        const caracteristicasArray = typeof caracteristicas === "string" 
          ? caracteristicas.split(",") 
          : caracteristicas;
        filters.caracteristicas = { $all: caracteristicasArray };
      }
      
      if (ciudad && pais) {
        filters.$and = [];
          filters.$and.push({ "direccion.ciudad.nombre": ciudad });
          filters.$and.push({ "direccion.ciudad.pais.nombre": pais });
      } else if (ciudad) {
        filters["direccion.ciudad.nombre"] = ciudad;
      } else if (pais) {
        filters["direccion.ciudad.pais.nombre"] = pais;
      }

      let rangoFechasObj;
      if (rangoFechas) {
        const [desdeStr, hastaStr] = rangoFechas.split(',');
        if (desdeStr && hastaStr) {
          const desde = new Date(desdeStr);
          const hasta = new Date(hastaStr);
          rangoFechasObj = new RangoFechas(desde, hasta);
        }
      }


      const result = await this.alojamientoService.findByMultipleFilters(
        filters,
        rangoFechasObj,
        parseInt(page),
        parseInt(limit)
      );
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}