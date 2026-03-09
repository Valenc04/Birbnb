import { z } from "zod"

const validarNotificacion = z.object({
    mensaje: z.string().min(1),
    usuario: z.string().or(z.number()),
    fechaAlta: z.date().optional(),
    leida: z.boolean().optional(),
    fechaLeida: z.date().optional()
})
export default validarNotificacion