import { UsuarioController } from "../controllers/UsuarioController.js";

export default function registerUsuarioRoutes(app, getController) {

    app.post("/usuario/signup", (req, res, next) => {
        getController(UsuarioController).create(req, res, next)
    })

    app.post("/usuario/login", (req, res, next) => {
       getController(UsuarioController).findUser(req, res, next)
    })

    app.put("/usuario/anfitrion", (req, res, next) => {
        getController(UsuarioController).convertirEnAnfitrion(req, res, next)
    })

    app.put("/usuario/huesped", (req, res, next) => {
        getController(UsuarioController).convertirEnHuesped(req, res, next)
    })

    app.get("/usuario/:id", (req,res,next) => {
        getController(UsuarioController).findByUser(req,res,next)
    })

    app.get("/usuario", (req, res, next) => {
        getController(UsuarioController).findAll(req, res, next);
    })

    app.delete("/usuario/:id", (req, res, next) => {
        getController(UsuarioController).delete(req, res, next)
    })
    
} 