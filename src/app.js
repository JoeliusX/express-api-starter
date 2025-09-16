// app.js
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

//pizza version
//const router = require('./Pizza/routes/router');
//const swaggerSpec = require('./Pizza/config/swagger');

//ingredients version
//const router = require('./Ingredients/routes/router');
//const swaggerSpec = require('./Ingredients/config/swagger');

//pizzaIngredients version
const router = require('./PizzaIngredients/routes/router');
const swaggerSpec = require('./PizzaIngredients/config/swagger');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api', router);

// Swagger UI pizza
/*
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
*/

// Swagger UI ingredient
/*
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
*/

// Swagger UI pizzaIngredient

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


// basic health-check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// error handler (fallback)
app.use((err, req, res, next) => {
    console.error(err);
    if (!res.headersSent) {
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else next(err);
});

module.exports = app;
