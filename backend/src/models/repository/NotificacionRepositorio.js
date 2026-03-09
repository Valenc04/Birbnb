import { NotificacionModel } from "../dbModels/NotificacionModel.js"
export class NotificacionRepositorio {
    constructor() {
        this.model = NotificacionModel
    }

    async findAllByFilter(filter, pageNum, limitNum) {
        const skip = (pageNum - 1) * limitNum

        return await this.model
            .find(filter)
            .skip(skip)
            .limit(limitNum)
            .populate('usuario')
            .lean()
    }

    async findById(id) {
        return await this.model
            .findById(id)
            .populate('usuario')
            .lean()
    }

    async findByUser(userId, notiId) {
        return await this.model
            .findOne({ usuario: userId, _id: notiId })
            .populate('usuario')
            .lean()
    }

    async countAll() {
        return await this.model.countDocuments()
    }

    async countAllByFilter(filtro) {
        return await this.model.countDocuments(filtro)
    }

    async save(notificacion) {
        const nuevo = new this.model(notificacion);
        await nuevo.save();
        return nuevo.toObject().populate("usuario")
    }

    async create(notificacion) {
        const nuevo = new this.model(notificacion)
        await nuevo.save()

        const populated = await this.model
            .findById(nuevo._id)
            .populate("usuario")
            .lean()

        return populated
    }


async update(noti) {
  const id = noti._id

  if (!id) throw new Error("No se puede actualizar una notificación sin ID")

  // Solo tomamos los campos que pueden actualizarse
  const camposActualizables = {
    leida: noti.leida,
    fechaLeida: noti.fechaLeida
  }

  return await this.model
    .findOneAndUpdate({ _id: id }, { $set: camposActualizables }, { new: true })
    .populate("usuario")
    .lean()
}
 async saveNotificacionReservar(notificacion) {
        const nuevo = new this.model(notificacion);
        await nuevo.save();
        await nuevo.populate('usuario');
        return nuevo.toObject();
    }

}
