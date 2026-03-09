import { Schema, model } from "mongoose"
import { Usuario } from "../entidades/Usuario.js"
import { TipoUsuario } from "../entidades/enums/TipoUsuario.js"

const usuarioSchema = new Schema({
    nombre: String,             
    email: String,
    password: String,
    tipo: {
        type: String,
        enum: Object.values(TipoUsuario),
        required: true
    }
})

usuarioSchema.loadClass(Usuario)
export const UsuarioModel = model('Usuario', usuarioSchema)