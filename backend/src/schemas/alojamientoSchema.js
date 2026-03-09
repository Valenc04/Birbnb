import mongoose from 'mongoose';
import { Alojamiento } from '../entities/Alojamiento.js';

const alojamientoSchema = new mongoose.Schema({
    anfitrion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres']
    },
    precioPorNoche: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo']
    },
    moneda: {
        type: String,
        required: true,
        enum: {
            values: ['DOLAR_USA', 'PESO_ARG', 'REALES'],
            message: 'Moneda no válida. Las opciones son: DOLAR_USA, PESO_ARG, REALES'
        }
    },
    horarioCheckIn: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
    },
    horarioCheckOut: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'],
        validate: {
            validator: function(v) {
                // Validar que el checkOut sea después del checkIn
                const checkIn = this.horarioCheckIn.split(':');
                const checkOut = v.split(':');
                const checkInMinutes = parseInt(checkIn[0]) * 60 + parseInt(checkIn[1]);
                const checkOutMinutes = parseInt(checkOut[0]) * 60 + parseInt(checkOut[1]);
                return checkOutMinutes > checkInMinutes;
            },
            message: 'El horario de check-out debe ser posterior al check-in'
        }
    },
    direccion: {
        ciudad: {
            type: String,
            required: true,
            trim: true
        },
        pais: {
            type: String,
            required: true,
            trim: true
        },
        coordenadas: {
            type: [Number], // [longitud, latitud]
            index: '2dsphere'
        }
    },
    cantHuespedesMax: {
        type: Number,
        required: true,
        min: [1, 'Debe permitir al menos 1 huésped']
    },
    caracteristicas: [{
        type: String,
        trim: true,
        enum: {
            values: ['wifi', 'piscina', 'aire acondicionado', 'cocina', 'tv', 'estacionamiento', 'apto mascotas'],
            message: 'Característica no válida'
        }
    }],
    reservas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva'
    }],
    fotos: [{
        url: {
            type: String,
            required: true,
            match: [/^https?:\/\/.+\..+$/, 'URL de foto no válida']
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [200, 'La descripción de la foto no puede exceder los 200 caracteres']
        }
    }],
    calificacionPromedio: {
        type: Number,
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5'],
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
});


alojamientoSchema.loadClass(Alojamiento);

export const AlojamientoModel = mongoose.model('Alojamiento', alojamientoSchema);