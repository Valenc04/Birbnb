import { z } from "zod";
import { EstadoReserva } from "../models/entidades/enums/EstadoReserva.js";

const validarCambioEstado = z.object({
  estado: z.enum([
    EstadoReserva.CONFIRMADA,
    EstadoReserva.CANCELADA,
    EstadoReserva.RECHAZADA,
  ]),
  motivo: z.string().optional(),
  usuario: z.object({
    idusuario: z.string(), 
  }),
});
export default validarCambioEstado;