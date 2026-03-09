import { AlojamientoModel } from "../dbModels/AlojamientoModel.js";
import { Alojamiento } from '../entidades/Alojamiento.js';

export class AlojamientoMongoRepository {
  constructor() {
    this.model = AlojamientoModel;
  }
  async removerReserva(alojamientoId, reservaId) {
  await this.model.findByIdAndUpdate(
    alojamientoId,
    { $pull: { reservas: reservaId } },
    { new: true }
  );
}
   async saveReserva(alojamientoId, reservaId) {
    const alojamientoActualizado = await this.model.findByIdAndUpdate(
      alojamientoId,
      { $push: { reservas: reservaId } },
      { new: true }
    );
    return alojamientoActualizado; 
  }
   async obtenerRangosDeFechasOcupadas(alojamientoId) {
      const alojamiento = await this.model.findById(alojamientoId)
    .populate({
      path: 'reservas',
      match: {estado: { $in: ['CONFIRMADA', 'PENDIENTE','CANCELADA'] } ,
        
       },
      select: 'rangoFechas -_id'  // 
    })
    .lean();
  if (!alojamiento || !alojamiento.reservas) return [];
  return alojamiento.reservas.map(reserva => reserva.rangoFechas);
}

  async obtenerLugares({ q = "", autocomplete = false, limit = 10 }) {
    if (isNaN(limit) || limit < 1) {
      throw new Error("El límite debe ser un número positivo");
    }

    if (autocomplete && (!q || q.trim().length < 2)) {
      return [];
    }

    const pipeline = [
      {
        $project: {
          ciudad: "$direccion.ciudad.nombre",
          pais: "$direccion.ciudad.pais.nombre",
        },
      },
    ];

    if (autocomplete && q && q.trim().length >= 2) {
      const regex = new RegExp(q.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { ciudad: { $regex: regex } },
            { pais: { $regex: regex } },
          ],
        },
      });
    }

    pipeline.push({
      $group: {
        _id: {
          ciudad: "$ciudad",
          pais: "$pais",
        },
      },
    });

    pipeline.push({ $limit: limit });

    const lugares = await this.model.aggregate(pipeline).exec();

    return lugares.map((l) => ({
      ciudad: l._id.ciudad || "",
      pais: l._id.pais || "",
    }));
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const totalItems = await this.model.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const items = await this.model
      .find()
      .skip(skip)
      .limit(limit)
      .populate("anfitrion")
      .populate("reservas")
      .lean();

    return {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems,
      totalPages,
      items,
    };
  }

  async findAllByAnfitrionId(anfitrionId, { page, limit }) {
        const skip = (page - 1) * limit;
        return await this.model
            .find({ anfitrion : anfitrionId })
            .skip(skip)
            .limit(limit)
            .populate('anfitrion')
  }

  async findByName(nombre) {
    return await this.model
      .findOne({ nombre })
      .populate("anfitrion")
      .populate("reservas")
      .lean();
  }

  async findById(id) {
    return this.model
      .findOne({ _id: id })
      .populate("anfitrion")
      .populate("reservas")
      .lean();
  }

  async save(alojamiento) {
    const nuevo = new this.model(alojamiento);
    await nuevo.save();
    return nuevo.toObject().populate("anfitrion").populate("reservas");
  }

  async findByMultipleFilters(filters, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const totalItems = await this.model.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await this.model
      .find(filters)
      .skip(skip)
      .limit(limit)
      .populate("anfitrion")
      .populate("reservas")
      .lean();

    return {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems,
      totalPages,
      items,
    };
  }

  async create(alojamiento) {
    const nuevo = new this.model(alojamiento);
    await nuevo.save();

    const populated = await this.model
      .findById(nuevo._id)
      .populate("anfitrion")
      .populate("reservas")
      .lean();

    return populated;
  }
}