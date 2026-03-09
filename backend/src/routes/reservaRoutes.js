import { ReservaController } from "../controllers/ReservaController.js";

export default function registerReservaRoutes(app, getController) {

    // Cancelación de una reserva antes de su fecha de inicio.
    //TODO: Corregir nombre de la ruta (no verbos)
    app.post("/reserva/:id/cambioEstado", (req, res, next) =>
        getController(ReservaController).cambioEstado(req, res, next)
    )
  
    // Es un post porque hay que instanciar una reserva
    app.get("/alojamiento/:id/disponible", (req, res, next) =>
        getController(ReservaController).disponible(req, res, next)
    )
    // Creación de una reserva, asegurando la disponibilidad del alojamiento en las fechas seleccionadas.
    app.post("/reserva", (req, res, next) =>
        getController(ReservaController).create(req, res, next)
    )

    // Consulta del historial de reservas de un usuario.
    app.get("/reserva/:userId/historial", (req, res, next) => {
        getController(ReservaController).findAllByUserId(req, res, next);
    })

    // Consulta totdas las reservas de un anfitrion
    app.get("/reserva/:userId/historial-anfitrion", (req, res, next) => {
        getController(ReservaController).findAllByAnfitrionId(req, res, next);
    })

    // Modificación de una reserva dentro de las reglas establecidas por el Sistema
    // (por ejemplo, cambios de fechas si el alojamiento sigue disponible).
    app.patch("/reserva/:id", (req, res, next) => {
        getController(ReservaController).update(req, res, next);
    })
}