import { ReservaModel } from "../dbModels/ReservaModel.js"


export class ReservaMongoRepository {
    constructor() {
        this.model = ReservaModel
    }


    async findById(id) {
        return await this.model
            .findOne({ _id: id })
            .populate('huespedReservador')
            .populate('alojamiento')
            // .lean(); al parecer al agregar .lean() no me deja usar los metodos de la reserva , como _actualizarEstado
    }

    async findAllByUserId(userId, { page, limit }) {
        const skip = (page - 1) * limit;
        return await this.model
            .find({ huespedReservador: userId })
            .skip(skip)
            .limit(limit)
            .populate('huespedReservador')
            .populate('alojamiento')
    }

    async countAllByUserId(userId) {
        return await this.model.countDocuments({ huespedReservador: userId });
    }

    async save(reserva) {

        const nuevo = new this.model(reserva);
        await nuevo.save();

        await nuevo.populate('huespedReservador');
        await nuevo.populate('alojamiento');

        return nuevo.toObject();
    }

    async saveUpdate(reservaActualizada) {
        const updateData = {
          estado: reservaActualizada.estado,
          "rangoFechas.fechaInicio": reservaActualizada.rangoFechas.fechaInicio,
          "rangoFechas.fechaFin": reservaActualizada.rangoFechas.fechaFin,
          cantHuespedes: reservaActualizada.cantHuespedes,
        };

        const updated = await this.model.findOneAndUpdate(
          { _id: reservaActualizada._id },
          updateData,
          { new: true }
        )
          .populate('huespedReservador')
          .populate('alojamiento');

        if (!updated) {
          throw new Error("No se pudo actualizar reserva");
        }

        return updated;
    }
        async delete(id) {
            const resultado = await this.model.findByIdAndDelete(id);
            if (!resultado) {
                throw new NotFoundException(`reserva con id ${id} no encontrado`);
            }
            return resultado.toObject();
        }
    


}