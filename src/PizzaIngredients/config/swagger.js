// PizzaIngredients/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PizzaIngredients API',
            version: '1.0.0',
            description: 'API for managing relations between pizzas and ingredients (SQLite, Express).'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local dev server' }
        ]
    },
    apis: ['./src/PizzaIngredients/routes/*.js', './src/PizzaIngredients/controllers/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
