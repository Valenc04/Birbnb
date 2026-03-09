import { AlojamientoController } from '../controllers/AlojamientoController.js';

export default function registerAlojamientoRoutes(app, getController) {
    app.post("/alojamientos", (req, res, next) =>
        getController(AlojamientoController).create(req, res, next)
    );

    app.get("/alojamientos/:id", (req, res, next) =>
        getController(AlojamientoController).findById(req, res, next)
    );
    app.get("/alojamiento/:id/reservas-ocupadas" , (req, res, next) =>
        getController(AlojamientoController).findByReservasOcupadas(req,res,next)
    );

    // Endpoint para búsqueda con múltiples filtros
    app.get("/alojamientos", (req, res, next) => {
        // Si hay múltiples parámetros de filtro, usa el nuevo método
        const queryParams = Object.keys(req.query);
        const hasMultipleFilters = queryParams.length > 1 || 
                                 (queryParams.length === 1 && !['page', 'limit'].includes(queryParams[0]));
        
        if (hasMultipleFilters) {
            return getController(AlojamientoController).findByMultipleFilters(req, res, next);
        }
        
        // Si no hay filtros, devuelve todos
        return getController(AlojamientoController).findAll(req, res, next);
    });
}