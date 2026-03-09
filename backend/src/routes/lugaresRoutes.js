import { LugaresController } from '../controllers/LugaresController.js';

export default function registerLugaresRoutes(app, getController) {
    app.get("/lugares", (req, res, next) =>
        getController(LugaresController).findAll(req, res, next)
    );
}