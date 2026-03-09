import { Notificacion } from "../Notificacion.js"
import { Usuario } from "../Usuario.js"
import { formatearMensajeNotificacion } from "../../../utils/formatearMensajeNotificacion.js"
import { diferenciaDias } from "../../../utils/diferenciaDias.js"

export let factoryNotificacion = {

    crearReserva(reserva) { // Cada vez que se realice una reserva es necesario enviarle una notificación al Anfitrión
        const huesped   = reserva.huespedReservador.nombre
        const inicioReserva           = reserva.rangoFechas.fechaInicio
        const finReserva              = reserva.rangoFechas.fechaFin
        const alojamiento             = reserva.alojamiento
        const duracion                = diferenciaDias(inicioReserva, finReserva)
        const anfitrion               = alojamiento.anfitrion

        const datosMensaje = {
            titulo: "📌 Nueva solicitud de reserva",
            huesped: `${huesped}`,
            alojamiento: `${alojamiento.nombre}`,
            inicioReserva: `${inicioReserva}`,
            finReserva: `${finReserva}`,
            duracion: `${duracion}`,
            adicional: "¡Preparate para recibir a tu huesped!"
        }

       const mensaje = formatearMensajeNotificacion(datosMensaje);        

        return {
            mensaje,
            usuario: anfitrion._id,
            fechaAlta: new Date(),
            leida: false,
            fechaLeida: null,
        };
        
    },

    confirmarReserva(reserva) {
        const huesped = reserva.huespedReservador
        const alojamiento = reserva.alojamiento
        const fechaInicio = reserva.rangoFechas.fechaInicio
        const fechaFin = reserva.rangoFechas.fechaFin
        const horarioCheckIn = alojamiento.horarioCheckIn
        const horarioCheckOut = alojamiento.horarioCheckOut

        const datosMensaje = {
            titulo: "✅ Tu reserva fue confirmada",
            alojamiento: `${alojamiento.nombre}`,
            inicioReserva: `${fechaInicio}`,
            fechaFin: `${fechaFin}`,
            horarioCheckIn: `${horarioCheckIn}`,
            horarioCheckOut: `${horarioCheckOut}`,
            adicional: "¡Disfrutá tu estadía!"
        }

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return {
            mensaje,
            usuario: huesped._id,
            fechaAlta: new Date(),
            leida: false,
            fechaLeida: null,
        };
    },

    cancelarReserva(reserva, motivo = '') {
        const anfitrion = reserva.alojamiento.anfitrion
        const huesped = reserva.huespedReservador
        const fechaInicio = reserva.rangoFechas.fechaInicio
        const fechaFin = reserva.rangoFechas.fechaFin

        const datosMensaje = {
            titulo: "❌ Reserva cancelada por el huésped",
            huesped: `${huesped.nombre}`,
            inicioReserva: `${fechaInicio}`,
            fechaFin: `${fechaFin}`,
            motivo: `${motivo}`
        }

        const mensaje = formatearMensajeNotificacion(datosMensaje)

        return {
            mensaje,
            usuario: anfitrion._id,
            fechaAlta: new Date(),
            leida: false,
            fechaLeida: null,
        };
    },

    rechazarReserva(reserva, motivo = '') {
        const anfitrion = reserva.alojamiento.anfitrion
        const huesped = reserva.huespedReservador
        const fechaInicio = reserva.rangoFechas.fechaInicio
        const fechaFin = reserva.rangoFechas.fechaFin

        const datosMensaje = {
            titulo: "❌ Reserva rechazada por el anfitrión",
            anfitrion: `${anfitrion.nombre}`,
            inicioReserva: `${fechaInicio}`,
            fechaFin: `${fechaFin}`,
            motivo: `${motivo}`
        }

        const mensaje = formatearMensajeNotificacion(datosMensaje)

        return {
            mensaje,
            usuario: huesped._id,
            fechaAlta: new Date(),
            leida: false,
            fechaLeida: null,
        };
    },

    recordarCheckInYCheckOut(reserva) { 
        const huesped   = reserva.huespedReservador
        const inicioReserva = reserva.inicioReserva
        const finReserva = reserva.finReserva
        const alojamiento = reserva.alojamiento
        const horarioCheckIn = alojamiento.horarioCheckIn
        const horarioCheckOut = alojamiento.horarioCheckOut

        const datosMensaje = {
            titulo: "📌 Recordatorio del Check-In y Check-Out",
            alojamiento: `${alojamiento.nombre}`,
            horarioCheckIn: `${horarioCheckIn}`,
            horarioCheckOut: `${horarioCheckOut}`,
            inicioReserva: `${inicioReserva}`,
            finReserva: `${finReserva}`,
            adicional: "¡Preparate para disfrutar!"
        }

        const mensaje = formatearMensajeNotificacion(datosMensaje)

        return {
            mensaje,
            usuario: huesped._id,
            fechaAlta: new Date(),
            leida: false,
            fechaLeida: null,
        };
    }
}