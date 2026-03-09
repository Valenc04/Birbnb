import { z } from "zod"

 const validarReserva = z.object({
  huespedReservador: z.object({
    idhuespedReservador: z.string().or(z.number()),
  }),
  alojamiento: z.object({
    idalojamiento: z.string().or(z.number()),
  }),
  cantHuespedes: z.number().min(1, "Debe haber al menos un huésped"),
    rangoFechas: z.object({
  fechaInicio:  z.preprocess(
  val => typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)) ? new Date(val) : val,
  z.date({ invalid_type_error: "La Fecha no es válida" })),

  fechaFin:  z.preprocess(
  val => typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)) ? new Date(val) : val,
  z.date({ invalid_type_error: "La Fecha no es válida" }))
  }).refine(
    data => data.fechaFin >= data.fechaInicio,
    {
      message: "La fecha de fin debe ser igual o posterior a la de inicio",
      
    }
  ),
  precioPorNoche: z.number().min(0),
});
export default validarReserva