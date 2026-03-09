import { CambioEstadoModel } from "../dbModels/CambioEstadoModel.js";

export class CambioEstadoMongoRepository {
  constructor() {
    this.model = CambioEstadoModel;
  }
  async save(CambioEstadoReserva) {
    const nuevo = new this.model(CambioEstadoReserva);
    await nuevo.save();
    await nuevo.populate("usuario");
    return nuevo.toObject();
  }
}