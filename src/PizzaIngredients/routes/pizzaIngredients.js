const express = require('express');
const { param, body } = require('express-validator');
const pizzaIngredientController = require('../controllers/pizzaIngredient');

const router = express.Router();

/**
 * @openapi
 * /api/pizzaIngredients/{pizzaId}/ingredients:
 *   get:
 *     summary: Get all ingredients for a pizza
 *     parameters:
 *       - in: path
 *         name: pizzaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of ingredients for the pizza
 *       404:
 *         description: Pizza not found
 *
 *   post:
 *     summary: Add an ingredient to a pizza
 *     parameters:
 *       - in: path
 *         name: pizzaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredientId
 *             properties:
 *               ingredientId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ingredient added to pizza
 *       400:
 *         description: Invalid input
 *
 * /api/pizzaIngredients/{pizzaId}/ingredients/{ingredientId}:
 *   delete:
 *     summary: Remove an ingredient from a pizza
 *     parameters:
 *       - in: path
 *         name: pizzaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ingredient removed from pizza
 *       404:
 *         description: Pizza or ingredient not found
 *
 * /api/pizzaIngredients/ingredients/{ingredientId}/pizzas:
 *   get:
 *     summary: Get all pizzas that contain a specific ingredient
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of pizzas
 *       404:
 *         description: Ingredient not found
 */

//Validation rules
const addIngredientValidation = [
    param('pizzaId').isInt().withMessage('pizzaId must be an integer'),
    body('ingredientId').isInt().withMessage('ingredientId must be an integer'),
];

const removeIngredientValidation = [
    param('pizzaId').isInt().withMessage('pizzaId must be an integer'),
    param('ingredientId').isInt().withMessage('ingredientId must be an integer'),
];

router.get('/:pizzaId/ingredients', [param('pizzaId').isInt()], pizzaIngredientController.getIngredientsByPizza);
router.post('/:pizzaId/ingredients', addIngredientValidation, pizzaIngredientController.addIngredient);
router.delete('/:pizzaId/ingredients/:ingredientId', removeIngredientValidation, pizzaIngredientController.removeIngredient);
router.get('/ingredients/:ingredientId/pizzas', [param('ingredientId').isInt()], pizzaIngredientController.getPizzasByIngredient);

module.exports = router;