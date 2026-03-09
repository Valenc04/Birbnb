import { UsuarioModel } from "../dbModels/UsuarioModel.js"
import { NotFoundException } from "../../exceptions/ErroresComunes.js";
export class UsuarioMongoRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async create(usuario) {
        const nuevo = new this.model(usuario);
        await nuevo.save();
        return nuevo.toObject();
    }

async updatePorEmail(email, camposActualizados) {
  const actualizado = await this.model.findOneAndUpdate(
    { email },
    camposActualizados,
    { new: true }
  );
  return actualizado?.toObject();
}

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const totalItems = await this.model.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.model.find()
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            page: parseInt(page),
            limit: parseInt(limit),
            totalItems,
            totalPages,
            items,
        };
    }

    async delete(id) {
        const resultado = await this.model.findByIdAndDelete(id);
        if (!resultado) {
            throw new NotFoundException(`Usuario con id ${id} no encontrado`);
        }
        return resultado.toObject();
    }

    async findByEmail(email) {
        const usuario = await this.model.findOne({ email }).lean();
        return usuario;
    }

    async findById(id) {
        const usuario = await this.model.findById(id).lean()
        return usuario
    }
}