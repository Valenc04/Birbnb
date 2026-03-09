
import {RangoFechas} from "../entidades/RangoFechas.js"
import { EstadoReserva } from "./enums/EstadoReserva.js"

export class Reserva {
    constructor({ huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estado, fechaAlta, _id }) {
        this._id = _id
        this.alojamiento = alojamiento
        this.cantHuespedes = cantHuespedes
        this.huespedReservador = huespedReservador
        this.precioPorNoche = precioPorNoche
        this.rangoFechas = rangoFechas instanceof RangoFechas ?
        rangoFechas : new RangoFechas(rangoFechas.fechaInicio, rangoFechas.fechaFin)
        this.estado = estado ?? EstadoReserva.PENDIENTE
        this.fechaAlta =  new Date()
        this.notifChecksEnviada = false
    }



    _actualizarEstado(nuevoEstado) {
             if (this.estado === nuevoEstado) {
            throw new Error("La reserva ya tenía ese estado")
        }
        this.estado = nuevoEstado
    }



    
    ocupaElRango(rangoFechas) {
        return this.rangoFechas.seSolapaCon(rangoFechas)
    }

    // revisarCheckInYCheckOut() {
    //     const ahora = new Date()
    //     const checkIn = this.alojamiento.horarioCheckIn()
    //     const checkOut = this.alojamiento.horarioCheckOut()

    //     if (minutosEntre(ahora, checkIn) < 60 && this.notifChecksEnviada) {
    //         factoryNotificacion.recordarCheckInYCheckOut(this)
    //         this.notifChecksEnviada = true
    //       }
    // }

}