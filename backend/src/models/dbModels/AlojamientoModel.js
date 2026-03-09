import mongoose, { Schema, model } from "mongoose"
import { Alojamiento } from "../entidades/Alojamiento.js"
import { Moneda } from "../entidades/enums/Moneda.js"
import { Caracteristica } from "../entidades/enums/Caracteristica.js"
import { Foto } from "../entidades/Foto.js"
import { Direccion } from "../entidades/Direccion.js"
import { Ciudad } from "../entidades/Ciudad.js"
import { Pais } from "../entidades/Pais.js"

const paisSchema = new Schema({
    nombre: String
})
paisSchema.loadClass(Pais)

const ciudadSchema = new Schema({
    nombre: String,
    pais: paisSchema
})
ciudadSchema.loadClass(Ciudad)

const direccionSchema = new Schema({
    calle: String,
    altura: String,
    ciudad: ciudadSchema,
    lat: String,
    long: String 
})
direccionSchema.loadClass(Direccion)

const fotoSchema = new Schema({
    descripcion: String,
    path: String
})
fotoSchema.loadClass(Foto)



const alojamientoSchema = new Schema({
    anfitrion: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    },         
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },             
    descripcion: String,      
    precioPorNoche: { 
        type: Number, 
        min: 0 
    },   
    moneda: {
        type: String,
        enum: Object.values(Moneda),
        required: true
    },
    horarioCheckIn: String,  
    horarioCheckOut: String,  
    direccion: direccionSchema,          
    cantHuespedesMax: { 
        type: Number, 
        min: 1 
    },  
    caracteristicas: [{
        type: String,
        enum: Object.values(Caracteristica),
        required: true
    }],    
    reservas: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Reserva'
    }],        
    fotos: [fotoSchema] 
})

alojamientoSchema.loadClass(Alojamiento);

export const AlojamientoModel = model('Alojamiento', alojamientoSchema)
