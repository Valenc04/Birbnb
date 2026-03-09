import mongoose, { Schema, model } from "mongoose"
import { Notificacion } from "../entidades/Notificacion.js"

const notificacionSchema = new Schema({
    id: Number,
    usuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    mensaje: String,
    fechaAlta: Date,
    leida: Boolean,
    fechaLeida: Date
})

notificacionSchema.loadClass(Notificacion)
export const NotificacionModel = model('Notificacion', notificacionSchema)