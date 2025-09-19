// app.js
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const pizzaRouter = require('./Pizza/routes/pizzas');
const pizzaSwaggerSpec = require('./Pizza/config/swagger');

const ingredientRouter = require('./Ingredients/routes/ingredients');
const ingredientSwaggerSpec = require('./Ingredients/config/swagger');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api/pizzas', pizzaRouter);
app.use('/api/ingredients', ingredientRouter);

// 🔗 Fusionner les deux Swagger en un seul
const combinedSwagger = {
    openapi: '3.0.0',
    info: {
        title: 'Pizza + Ingredients API',
        version: '1.0.0',
    },
    paths: {
        ...pizzaSwaggerSpec.paths,
        ...ingredientSwaggerSpec.paths
    },
    components: {
        ...pizzaSwaggerSpec.components,
        ...ingredientSwaggerSpec.components
    }
};

// Swagger UI unique
app.use('/docs', swaggerUi.serve, swaggerUi.setup(combinedSwagger));
app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(combinedSwagger);
});

// basic health-check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (!res.headersSent) {
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else next(err);
});

module.exports = app;
