// Pizza/controllers/pizza.js
const { validationResult } = require('express-validator');
const Pizza = require('../entities/Pizza');
const Ingredient = require('../../Ingredients/entities/Ingredient');
const axios = require('axios');

// helper to validate existing ingredients
async function validateIngredientIds(ingredientIds) {
    if (!Array.isArray(ingredientIds)) return [];
    const validIds = [];
    for (const id of ingredientIds) {
        const ingredient = await Ingredient.findById(id);
        if (ingredient) validIds.push(id);
    }
    return validIds;
}

// Create a new pizza
exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, description, imageUrl, price, dailyPizza, ingredients = [] } = req.body;

        const validIngredients = await validateIngredientIds(ingredients);

        const created = await Pizza.create({
            name,
            description,
            imageUrl,
            price,
            dailyPizza,
            ingredients: validIngredients
        });

        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// Update pizza
exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        let { name, description, imageUrl, price, dailyPizza, ingredients } = req.body;

        let validIngredients = ingredients ? await validateIngredientIds(ingredients) : undefined;

        const updated = await Pizza.update(id, {
            name,
            description,
            imageUrl,
            price,
            dailyPizza,
            ingredients: validIngredients
        });

        if (!updated) return res.status(404).json({ error: 'Pizza not found' });

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Add an ingredient to a pizza
exports.addIngredient = async (req, res, next) => {
    try {
        const pizzaId = Number(req.params.id);
        const ingredientId = Number(req.body.ingredientId);

        if (Number.isNaN(pizzaId) || Number.isNaN(ingredientId)) {
            return res.status(400).json({ error: 'Invalid id' });
        }

        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) return res.status(400).json({ error: 'Ingredient does not exist' });

        await Pizza.addIngredient(pizzaId, ingredientId);

        const pizza = await Pizza.findById(pizzaId);
        pizza.ingredients = await Ingredient.findByPizzaId(pizzaId);

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

// Remove an ingredient from a pizza
exports.removeIngredient = async (req, res, next) => {
    try {
        const pizzaId = Number(req.params.id);
        const ingredientId = Number(req.params.ingredientId);

        if (Number.isNaN(pizzaId) || Number.isNaN(ingredientId)) {
            return res.status(400).json({ error: 'Invalid id' });
        }

        const removed = await Pizza.removeIngredient(pizzaId, ingredientId);

        if (!removed) return res.status(404).json({ error: 'Ingredient not found in pizza' });

        const pizza = await Pizza.findById(pizzaId);
        pizza.ingredients = await Ingredient.findByPizzaId(pizzaId);

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

// Find all pizzas
exports.findAll = async (req, res, next) => {
    try {
        const pizzas = await Pizza.findAll();
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};

// Find one pizza by id
exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const pizza = await Pizza.findById(id);
        if (!pizza) return res.status(404).json({ error: 'Pizza not found' });

        pizza.ingredients = await Ingredient.findByPizzaId(id);

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

// Delete pizza
exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const deleted = await Pizza.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Pizza not found' });

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
