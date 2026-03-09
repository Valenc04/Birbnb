import { Notificacion } from "../models/entidades/Notificacion.js"
import { NotFoundException, CreationException, ValidationException, ConflictException, DoesNotBelongToUserException} 
from "../exceptions/ErroresComunes.js" 
import notificacionSchema from "../schemas/notificacionSchema.js"
import { parseZodIssues } from "../utils/parseZodIssues.js"
import { validarObjectId } from "../utils/validarObjectId.js"

export class NotificacionService {
    constructor(notificacionRepo, usuarioRepo) {
        this.notificacionRepo = notificacionRepo
        this.usuarioRepo = usuarioRepo
    }

    async findByUserWithFiltro(userId, filtroExtra = {}, page = 1, limit = 10) {
        validarObjectId(userId, "userId")
        
        const filtro = { usuario: userId, ...filtroExtra }
        const notificaciones = await this.notificacionRepo.findAllByFilter(filtro, page, limit)

        if(!notificaciones) {
            throw new NotFoundException(`No se encontraron notificaciones con el filtro proporcionado`)
        }

        if(notificaciones.some(n => !n.usuario)) {
            throw new NotFoundException(`No se encontro el usuario con ID ${userId}`)
        }

        const total = await this.notificacionRepo.countAllByFilter(filtro) 
        const total_pages = Math.ceil(total / limit)
        const data = notificaciones.map(n => this.toDTO(n))

        return {
            page,
            limit,
            total,
            total_pages,
            data
        }
    }

    async findAllByUser(userId, page = 1, limit = 10) {
        return this.findByUserWithFiltro(userId, {}, page, limit)
    }

    async findLeidasByUser(userId, page = 1, limit = 10) {
        return this.findByUserWithFiltro(userId, { leida: true }, page, limit)
    }

    async findNoLeidasByUser(userId, page = 1, limit = 10) {
        return this.findByUserWithFiltro(userId, { leida: false }, page, limit)
    }

    async findById(notiId) {
        validarObjectId(notiId, "notiId")

        const notificacion = await this.notificacionRepo.findById(notiId)

        if (!notificacion) {
            throw new NotFoundException(`Notificacion de ID ${notiId} no encontrada`)
        }

        return this.toDTO(notificacion)
    }

    async findByUser(userId, notiId) {
        validarObjectId(userId, "userId")
        validarObjectId(notiId, "notiId")

        const notificacion = await this.notificacionRepo.findByUser(userId, notiId)

        if(!notificacion) {
            throw new NotFoundException(`Notificacion de ID ${notiId} no encontrada`)
        }
        if(!notificacion.usuario) {
            throw new NotFoundException(`No se encontro el usuario con ID ${userId}`)
        }

        return this.toDTO(notificacion)
    }

    async marcarNotificacionComoLeida(userId, notiId) {
        validarObjectId(userId, "usuario")
        validarObjectId(notiId, "notiId")

        const notificacion = await this.notificacionRepo.findByUser(userId, notiId)

        if (!notificacion) {
            throw new NotFoundException(`Notificacion de ID ${notiId} no encontrada`)
        }

        if (notificacion.usuario._id.toString() !== userId.toString()) { 
            throw new DoesNotBelongToUserException(`
                Notificacion de ID ${notiId} no pertenece al usuario de ID ${userId}`)
        }

        if (notificacion.leida) {
            throw new ConflictException(`La Notificacion con ID ${notiId} ya fue marcada como leida`)
        }

        const instanciaDeNotificacion = new Notificacion({
            usuario: notificacion.usuario._id,
            mensaje: notificacion.mensaje
        })
        instanciaDeNotificacion.marcarComoLeida() 
        instanciaDeNotificacion._id = notificacion._id

        const notiActualizada = await this.notificacionRepo.update(instanciaDeNotificacion)

        if (!notiActualizada) {
            throw new ConflictException(`No se pudo actualizar la notificacion con ID ${notiId}`)
        }

        return this.toDTO(notiActualizada)
    }

    async create(notificacionData) {
        this.validarNotificacion(notificacionData)

        const user = this.usuarioRepo.findById(notificacionData.usuario)
        if(!user) {
            throw new NotFoundException(`El usuario no se encuentra registrado`)
        }

        const nuevaNoti = new Notificacion(notificacionData)
        const notiGuardada = await this.notificacionRepo.create(nuevaNoti)

        if(!notiGuardada) throw new CreationException(`No se ha podido crear la notificacion`)
        
        return this.toDTO(notiGuardada)
    }
      async EnviarNotificacionDeLaReserva(notificacion){
       const nuevaNotificacion =  await this.notificacionRepo.saveNotificacionReservar(notificacion);
        if (!nuevaNotificacion) {
      throw new CreationException("No se pudo actualizar la notificacion");
        
    }
        return nuevaNotificacion;
    }

    toDTO(notificacion) {
        if(!notificacion) return null;

        return {
            id: notificacion._id?.toString(),
            mensaje: notificacion.mensaje?.trim() || "",
            usuario: {
                userId: notificacion.usuario?._id?.toString() || "",
                nombre: notificacion.usuario?.nombre?.trim() || "",
                email: notificacion.usuario?.email?.trim() || "",
                tipo: notificacion.usuario?.tipo?.trim() || ""
            },
            fechaAlta: notificacion.fechaAlta?.toISOString() || null,
            leida: notificacion.leida ?? false,
            fechaLeida: notificacion.fechaLeida?.toISOString() || null
        }
    }

    validarNotificacion(notificacionData) {
        const errores = []

        validarObjectId(notificacionData.usuario, "usuario")

        if(notificacionData.mensaje.length < 8) {
            errores.push("El mensaje debe tener al menos 8 caracteres")
        }

        if (errores.length > 0) {
            throw new ValidationException(errores.join(" | "))
        }
    }
}

