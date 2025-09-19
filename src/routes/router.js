// routes/router.js
const express = require('express');
const pizzaRouter = require('../Pizza/routes/pizzas');
const ingredientRouter = require('../Ingredients/routes/ingredients');

const router = express.Router();

router.use('/pizzas', pizzaRouter);
router.use('/ingredients', ingredientRouter);

module.exports = router;
