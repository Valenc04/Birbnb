import { ConflictException} from "../../exceptions/ErroresComunes.js"

export class Notificacion {
    mensaje        // String
    usuario        // _id de mongodb
    fechaAlta      // Date
    leida          // boolean
    fechaLeida     // Date

    constructor({mensaje, usuario}) {
        this.mensaje = mensaje
        this.usuario = usuario
        this.fechaAlta = new Date()
        this.leida = false
        this.fechaLeida = null
    }

    marcarComoLeida() {
        if(this.leida) {
            throw new ConflictException(`La Notificacion con ID ${this.id} ya fue marcada como leida`)
        }

        this.leida = true
        this.fechaLeida = new Date()      
    }
}
