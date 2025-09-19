// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizza & Ingredients API',
            version: '1.0.0',
            description: 'RESTful API for pizza and ingredient management (SQLite, Express) with a table intermédiaire.'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local dev server' }
        ]
    },

    apis: [
        './src/Pizza/routes/*.js',
        './src/Pizza/controllers/*.js',
        './src/Ingredients/routes/*.js',
        './src/Ingredients/controllers/*.js'
    ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
