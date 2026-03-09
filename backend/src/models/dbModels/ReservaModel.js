import mongoose, { Schema, model } from "mongoose"
import {Reserva} from "../entidades/Reserva.js"
import { EstadoReserva } from "../entidades/enums/EstadoReserva.js"
import { RangoFechas } from "../entidades/RangoFechas.js"

const rangoFechasSchema = new Schema({
    fechaInicio: Date,
    fechaFin: Date
})
rangoFechasSchema.loadClass(RangoFechas)

const reservaSchema = new Schema({
    fechaAlta: { 
        type: Date, 
        default: Date.now 
    },
    huespedReservador: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    cantHuespedes: { 
        type: Number, 
        min: 1 
    },
    alojamiento: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Alojamiento'
    },
    rangoFechas: rangoFechasSchema,
    estado: {
        type: String,
        enum: Object.values(EstadoReserva),
        required: true
    },
    precioPorNoche: { 
        type: Number, 
        min: 0 
    }
})

reservaSchema.loadClass(Reserva)
export const ReservaModel = model('Reserva', reservaSchema)