// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'API Alojamientos',
//             version: '1.0.0',
//             description: 'Búsqueda con filtros y paginación'
//         },
//         components: {
//             schemas: {
//                 Alojamiento: {
//                     type: 'object',
//                     properties: {
//                         id: { type: 'string' },
//                         nombre: { type: 'string' },
//                         precioPorNoche: { type: 'number' },
//                         direccion: {
//                             type: 'object',
//                             properties: {
//                                 ciudad: { type: 'string' },
//                                 pais: { type: 'string' }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     },
//     apis: ['./src/routes/*.js']
// };

// export const setupSwagger = (app) => {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
// };