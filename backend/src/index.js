
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import apiDocs from './docs/api-docs.json' with { type: 'json' };
dotenv.config();


import express from "express";
import { Server } from "./server/server.js";
import { MongoDBConnection } from "./db/MongoDBConnection.js";
import { AlojamientoController } from "./controllers/AlojamientoController.js";
import { AlojamientoService } from "./services/AlojamientoService.js";
import { AlojamientoMongoRepository } from "./models/repository/AlojamientoMongoRepository.js"
import { ReservaMongoRepository } from "./models/repository/ReservaMongoRepository.js";
import { ReservaController } from "./controllers/ReservaController.js";
import { ReservaService } from "./services/ReservaService.js";
import { NotificacionRepositorio } from "./models/repository/NotificacionRepositorio.js";
import { NotificacionService } from "./services/NotificacionService.js";
import { NotificacionController } from "./controllers/NotificacionController.js";
import { UsuarioMongoRepository } from "./models/repository/UsuarioMongoRepositorio.js"
import { UsuarioService } from "./services/UsuarioService.js"
import { UsuarioController } from "./controllers/UsuarioController.js";
import { LugarService } from "./services/LugaresService.js";
import { LugaresController } from "./controllers/LugaresController.js";
import { CambioEstadoMongoRepository } from "./models/repository/CambioDeEstadoMongoRepository.js";
import cors from "cors";


const app = express();
const port = process.env.PORT || 3000;
const server = new Server(app, port);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(cors({
   origin: '*', // Permite todas las solicitudes de origen cruzado
   methods: '*', // Métodos permitidos
   allowedHeaders: '*' // Encabezados permitidos
})); // Si usas Express


MongoDBConnection.connect();


// Configuración de dependencias
const cambioDeEstadoMongoRepository = new CambioEstadoMongoRepository();


const alojamientoRepository = new AlojamientoMongoRepository();
const alojamientoService = new AlojamientoService(alojamientoRepository);
const alojamientoController = new AlojamientoController(alojamientoService);
const lugaresService = new LugarService(alojamientoRepository);
const lugaresController = new LugaresController(lugaresService);

const usuarioRepository = new UsuarioMongoRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService)

const notificacionRepositorio = new NotificacionRepositorio();
const notificacionService = new NotificacionService(notificacionRepositorio, usuarioRepository);
const notificacionController = new NotificacionController(notificacionService);

const reservaMongoRepository = new ReservaMongoRepository();
const reservaService = new ReservaService(reservaMongoRepository, alojamientoService, alojamientoRepository, usuarioService, notificacionService ,cambioDeEstadoMongoRepository );
const reservaController = new ReservaController(reservaService);


// Registro de controladores en el servidor
server.setController(AlojamientoController, alojamientoController);
server.setController(ReservaController, reservaController);
server.setController(NotificacionController, notificacionController);
server.setController(UsuarioController, usuarioController);
server.setController(LugaresController, lugaresController);


// Configuración de rutas y lanzamiento
server.configureRoutes();
server.launch();