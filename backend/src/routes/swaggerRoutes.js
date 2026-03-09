import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = JSON.parse(
  readFileSync(path.join(__dirname, '../docs/api-docs.json'), 'utf-8')
);

const router = express.Router();

router.use('/', swaggerUi.serve);  // Cambiado a ruta raíz del router
router.get('/', swaggerUi.setup(swaggerDocument)); // Usa la misma ruta

export default router;