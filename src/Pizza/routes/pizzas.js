// Pizza/routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('../controllers/pizza');

const router = express.Router();

/**
 * @openapi
 * /api/pizzas:
 *   get:
 *     summary: Retrieve a list of pizzas
 *     responses:
 *       200:
 *         description: A list of pizzas
 *   post:
 *     summary: Create a new pizza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - dailyPizza
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               dailyPizza:
 *                 type: boolean
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/pizzas/{id}:
 *   get:
 *     summary: Get a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single pizza
 *       404:
 *         description: Pizza not found
 *   put:
 *     summary: Update a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               dailyPizza:
 *                 type: boolean
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizza not found
 *   delete:
 *     summary: Delete a pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       404:
 *         description: Pizza not found
 */

/**
 * @openapi
 * /api/pizzas/{id}/ingredients:
 *   post:
 *     summary: Add an ingredient to a pizza
 *     parameters:
 *       - in: path
 *         name: id
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
 *       200:
 *         description: Ingredient added to pizza
 *       400:
 *         description: Invalid id
 *   delete:
 *     summary: Remove an ingredient from a pizza
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ingredient removed from pizza
 *       400:
 *         description: Invalid id
 */

/**
 * @openapi
 * /api/pizzas/{id}/with-ingredients:
 *   get:
 *     summary: Get a pizza with detailed ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pizza with ingredients details
 *       404:
 *         description: Pizza not found
 */

// Validation rules
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('description').optional().isString(),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
    body('dailyPizza').isBoolean().withMessage('dailyPizza must be a boolean'),
    body('ingredients').optional().isArray().withMessage('ingredients must be an array of ids')
];

// Pizza routes
router.get('/', pizzaController.findAll);
router.post('/', createAndUpdateValidations, pizzaController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
router.get('/:id/with-ingredients', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOneWithIngredients);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);

// Add/remove ingredient routes using table intermédiaire pizza_ingredients
router.post('/:id/ingredients', [param('id').isInt(), body('ingredientId').isInt()], pizzaController.addIngredient);
router.delete('/:id/ingredients/:ingredientId', [param('id').isInt(), param('ingredientId').isInt()], pizzaController.removeIngredient);

module.exports = router;