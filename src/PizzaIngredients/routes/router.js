// PizzaIngredients/routes/router.js
const express = require('express');
const pizzaIngredientsRouter = require('./pizzaIngredients');

const router = express.Router();

router.use('/pizzaIngredients', pizzaIngredientsRouter);

module.exports = router;
