import { TipoUsuario } from "./enums/TipoUsuario.js"

export class Usuario {


    constructor({ nombre, email, password}) {
        this.nombre            = nombre
        this.email             = email
        this.password          = password
        this.tipo              = TipoUsuario.HUESPED
    }

    serAnfitrion() {
        this.tipo = TipoUsuario.ANFITRION
    }

    serHuesped() {
        this.tipo = TipoUsuario.HUESPED
    }
}