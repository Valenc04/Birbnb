export class NotificacionController {
    constructor(notiService) {
        this.notiService = notiService
    }

    /*findById = async (req, res, next) => {
        try {
            const notificacion = await this.notiService.findById(req.params.notiId)
            res.status(200).json(notificacion)
        } catch (error) {
            next(error)
        }
    } Por ahora no lo utilizo */

    findByUser = async (req, res, next) => {
        try {
            const notificacion = await this.notiService.findByUser(req.params.userId, req.params.notiId)
            res.status(200).json(notificacion)
        } catch (error) {
            next(error)
        }
    }

    findAllByUser = async (req, res, next) => {
        const { page, limit } = req.query

        try {
            const notificaciones = await this.notiService.findAllByUser(req.params.userId, page, limit)
            res.status(200).json(notificaciones)
        } catch (error) {
            next(error)
        }
    }

    findLeidasByUser  = async (req, res, next) => {
        const { page, limit } = req.query

        try {
            const notisLeidasDelUsuario = await this.notiService.findLeidasByUser(req.params.userId, page, limit)
            return res.status(200).json(notisLeidasDelUsuario)
        } catch (error) {
            next(error)
        }
    }

    findNoLeidasByUser = async (req, res, next) => {
        const { page, limit } = req.query

        try {
            const notisNoLeidasDelUsuario = await this.notiService.findNoLeidasByUser(req.params.userId, page, limit)
            return res.status(200).json(notisNoLeidasDelUsuario)
        } catch (error) {
            next(error)
        }
    }

    crearNotificacion = async (req, res, next) => {
        try {
            const notificacion = await this.notiService.create(req.body)
            return res.status(201).json(notificacion)
        } catch (error) {
            next(error)
        }
    }

    marcarNotificacionComoLeida = async (req, res, next) => {
        try {
            const notificacionMarcada = await this.notiService.marcarNotificacionComoLeida(req.params.userId, req.params.notiId)
            return res.status(200).json(notificacionMarcada)
        } catch (error) {
            next(error)
        }
    }
}