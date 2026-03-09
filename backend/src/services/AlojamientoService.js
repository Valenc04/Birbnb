import { Alojamiento } from "../models/entidades/Alojamiento.js";
import {
  AlojamientoQueryParamsInvalidException,
} from "../exceptions/AlojamientoException.js";
import { CARACTERISTICAS_VALIDAS } from "../models/entidades/enums/Caracteristica.js";
import { ValidationException, NotFoundException, AlreadyExistsException, ConflictException } from "../exceptions/ErroresComunes.js"
import { MONEDAS } from "../models/entidades/enums/Moneda.js";

export class AlojamientoService {
  constructor(alojamientoRepositorio) {
    this.alojamientoRepositorio = alojamientoRepositorio;
  }

  async create(alojamientoData) {
    const errores = this.validarAlojamiento(alojamientoData);
    if (errores.length > 0) {
      throw new ValidationException(errores);
    }
    const existe = await this.alojamientoRepositorio.findByName(
      alojamientoData.nombre
    );
    if (existe) {
      throw new AlreadyExistsException(
        `Ya existe un alojamiento con el nombre ${alojamientoData.nombre}`
      );
    }
    const alojamiento = new Alojamiento(alojamientoData);
    const alojamientoCreado = await this.alojamientoRepositorio.create(
      alojamiento
    );
    return this.toDTO(alojamientoCreado);
  }

  async findById(alojamientoId) {
    const alojamiento = await this.alojamientoRepositorio.findById(alojamientoId);
    if (!alojamiento) {
      throw new NotFoundException(
        `Alojamiento con id ${alojamientoId} no encontrado`
      );
    }
    return this.toDTO(alojamiento);
  }

  async findAll(page = 1, limit = 10) {
    const result = await this.alojamientoRepositorio.findAll(
      parseInt(page),
      parseInt(limit)
    );

    return {
      ...result,
      items: result.items.map((alojamiento) => this.toDTO(alojamiento)),
    };
  }

  async findByName(name) {
    const alojamiento = await this.alojamientoRepositorio.findByName(name);
    if (!alojamiento) {
      throw new NotFoundException(
        `Alojamiento con nombre: ${name} no encontrado`
      );
    }
    return this.toDTO(alojamiento);
  }

  async findByMultipleFilters(filters, rangoFechas, page = 1, limit = 10) {
    if (isNaN(page) || isNaN(limit)) {
      throw new AlojamientoQueryParamsInvalidException(
        "Los parámetros de paginación deben ser números"
      );
    }

    if (page < 1 || limit < 1) {
      throw new AlojamientoQueryParamsInvalidException(
        "Los parámetros de paginación deben ser positivos"
      );
    }

    const resultRaw = await this.alojamientoRepositorio.findByMultipleFilters(
      filters,
      parseInt(page),
      parseInt(limit)
    );

    const alojamientos = resultRaw.items.map(item => new Alojamiento(item));

    const filtered = rangoFechas
      ? alojamientos.filter(a => a.estasDisponibleEn(rangoFechas))
      : alojamientos;

    if (filtered.length === 0) {
      throw new NotFoundException(
        "No se encontraron alojamientos con los filtros especificados"
      );
    }

    return {
      ...resultRaw,
      items: resultRaw.items.map((alojamiento) => this.toDTO(alojamiento)),
    };
  }
  async buscarAlojamientoActivo(alojamientoId){
        const alojamiento = await this.alojamientoRepositorio.findById(alojamientoId);
    if (!alojamiento) {
      throw new NotFoundException(
        `Alojamiento con id ${alojamientoId} no encontrado`
      );
    }
    return alojamiento;
  }

  async guardarReservaEnAlojmiento(alojamientoid , reservaid){
   const alojamiento = await this.alojamientoRepositorio.saveReserva(alojamientoid,reservaid);
   if(!alojamiento){
    throw new ConflictException("No se pudo guardar la reserva");
   }
 return alojamiento;
  }
   async ReservasOcupadas(alojamientoId){

      const rangoDeFechas = await this.alojamientoRepositorio.obtenerRangosDeFechasOcupadas(alojamientoId);
       
  if (!rangoDeFechas) throw new Error('rangoDeFechas no encontrado');
     
    return this.toDTOrangoDeFechas(rangoDeFechas);
  }

  validarAlojamiento(alojamientoData) {
    const errores = [];

    if (!alojamientoData.nombre?.trim()) {
      errores.push("El nombre es obligatorio");
    }

    if (
      typeof alojamientoData.precioPorNoche !== "number" ||
      alojamientoData.precioPorNoche <= 0
    ) {
      errores.push("El precio por noche debe ser un número positivo");
    }

    if (!alojamientoData.anfitrion) {
      errores.push("El anfitrión es obligatorio");
    }

    if (!alojamientoData.moneda) {
      errores.push("La moneda es obligatoria");
    } else if (!MONEDAS.includes(alojamientoData.moneda)) {
      errores.push(
        `Moneda no válida: ${alojamientoData.moneda}. ` +
        `Valores permitidos: ${MONEDAS.join(", ")}`
      );
    }

    if (
      !alojamientoData.cantHuespedesMax ||
      alojamientoData.cantHuespedesMax < 1
    ) {
      errores.push("Debe permitir al menos 1 huésped");
    }

    if (!alojamientoData.direccion?.ciudad?.nombre?.trim()) {
      errores.push("El nombre de la ciudad es obligatorio");
    }

    if (!alojamientoData.direccion?.ciudad?.pais?.nombre?.trim()) {
      errores.push("El nombre del país es obligatorio");
    }

    return errores;
  }
   toDTOrangoDeFechas(rangoFechas) {
 return rangoFechas.map(rango => ({
    fechaInicio: rango.fechaInicio.toISOString(), // o rango.fechaInicio si preferís Date
    fechaFin: rango.fechaFin.toISOString(),
  }));
}

  toDTO(alojamiento) {
    if (!alojamiento) return null;

    return {
      id: alojamiento._id?.toString() || alojamiento.id,
      nombre: alojamiento.nombre?.trim() || "",
      anfitrion: {
        nombre: alojamiento.anfitrion?.nombre?.trim() || "",
        email: alojamiento.anfitrion?.email?.trim() || "",
        tipo: alojamiento.anfitrion?.tipo?.trim() || "",
      },
      descripcion: alojamiento.descripcion?.trim() || "",
      precioPorNoche: Number(alojamiento.precioPorNoche) || 0,
      moneda: MONEDAS.includes(alojamiento.moneda?.toUpperCase())
        ? alojamiento.moneda.toUpperCase()
        : "PESO_ARG",
      cantHuespedesMax: alojamiento.cantHuespedesMax || 1,
      direccion: {
        calle: alojamiento.direccion?.calle?.trim() || "",
        ciudad: {
          id:
            alojamiento.direccion?.ciudad?._id?.toString() ||
            alojamiento.direccion?.ciudad?.id ||
            null,
          nombre: alojamiento.direccion?.ciudad?.nombre?.trim() || "",
          pais: {
            id:
              alojamiento.direccion?.ciudad?.pais?._id?.toString() ||
              alojamiento.direccion?.ciudad?.pais?.id ||
              null,
            nombre: alojamiento.direccion?.ciudad?.pais?.nombre?.trim() || "",
          },
        },
        coordenadas: {
          lat: parseFloat(alojamiento.direccion?.lat) || 0,
          long: parseFloat(alojamiento.direccion?.long) || 0,
        },
      },
      caracteristicas: (alojamiento.caracteristicas || [])
        .map((c) => c?.trim().toUpperCase())
        .filter((c) => c && Object.values(CARACTERISTICAS_VALIDAS).includes(c)),
      fotos: (alojamiento.fotos || []).map((foto) => ({
        path: foto?.path?.trim() || "",  // Cambiado de 'url' a 'path'
        descripcion: foto?.descripcion?.trim() || "",
      })),
    };
  }
}