// app.js
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const router = require('./routes/router');      // Le router central
const swaggerSpec = require('./config/swagger'); // Le swagger combiné

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api', router); // Tout passe par /api

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (!res.headersSent) {
        res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else next(err);
});

module.exports = app;
