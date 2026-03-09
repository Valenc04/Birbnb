import mongoose from "mongoose"
import { ValidationException } from "../exceptions/ErroresComunes.js"

export function validarObjectId(id, nombreCampo) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationException(`El ID de ${nombreCampo} no es válido`)
  }
}
