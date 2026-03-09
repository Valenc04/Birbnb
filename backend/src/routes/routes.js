import registerAlojamientoRoutes from './alojamientoRoutes.js';
import registerReservaRoutes from './reservaRoutes.js';
import registerNotificationRoutes from "./notificacionRouter.js";
import registerHealthRoutes from './health.js';
import registerUsuarioRoutes from './usuarioRoutes.js';
import registerLugaresRoutes from './lugaresRoutes.js';


export function configureRoutes(app, getController) {
    registerAlojamientoRoutes(app, getController);
    registerReservaRoutes(app, getController);
    registerNotificationRoutes(app, getController);
    registerHealthRoutes(app, getController);
    registerUsuarioRoutes(app, getController);
    registerLugaresRoutes(app, getController);
    //TODO: Faltan los swagger routes
}