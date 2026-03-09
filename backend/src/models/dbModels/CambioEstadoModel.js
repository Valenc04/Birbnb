import mongoose, { Schema, model } from "mongoose";
import { EstadoReserva } from "../entidades/enums/EstadoReserva.js";

import { CambioEstadoReserva } from "../entidades/CambioEstadoReserva.js";
const cambioEstadoSchema = new Schema({
  fechaAlta: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: Object.values(EstadoReserva),
    required: true,
  },
  motivo: {
    type: String,
    required: false,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reserva",
    required: true,
  },
});
cambioEstadoSchema.loadClass(CambioEstadoReserva);
export const CambioEstadoModel = model(
  "CambioEstadoReserva",
  cambioEstadoSchema
);
