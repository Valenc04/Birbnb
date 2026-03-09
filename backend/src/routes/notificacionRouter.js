import { NotificacionController } from '../controllers/NotificacionController.js'

export default function registerNotificationRoutes(app, getController) {

    //Obtener las notificaciones LEIDAS de un usuario
    app.get("/notificaciones/:userId/leidas", (req, res, next) => {
        getController(NotificacionController).findLeidasByUser(req, res, next)
    })

    //Obtener las notificaciones NO LEIDAS de un usuario
    app.get("/notificaciones/:userId/no-leidas", (req, res, next) => {
        getController(NotificacionController).findNoLeidasByUser(req, res, next)
    })
    
    //Obtener una notificacion especifica de un usuario
    app.get("/notificaciones/:notiId/:userId", (req, res, next) => {
        getController(NotificacionController).findByUser(req, res, next) 
    })

    //Obtener todas las nofiticaciones de un usuario
    app.get("/notificaciones/:userId", (req, res, next) => {
        getController(NotificacionController).findAllByUser(req, res, next) 
    })

    app.post("/notificaciones", (req, res, next) => {
        getController(NotificacionController).crearNotificacion(req, res, next) 
    })

    //Marcar una notificacion especifica como leida
    app.patch("/notificaciones/:notiId/:userId/leer", (req, res, next) => {
        getController(NotificacionController).marcarNotificacionComoLeida(req, res, next) 
    })
}