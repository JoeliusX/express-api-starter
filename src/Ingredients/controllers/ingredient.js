// Ingredients/controllers/ingredient.js
const { validationResult } = require('express-validator');
const Ingredient = require('../entities/Ingredient');
const db = require('../../config/database');

// Create a new ingredient
exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name } = req.body;
        const created = await Ingredient.create({ name });

        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// Retrieve all ingredients
exports.findAll = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.findAll();
        return res.status(200).json(ingredients);
    } catch (err) {
        next(err);
    }
};

// Retrieve one ingredient by ID
exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ingredient id' });

        const ingredient = await Ingredient.findById(id);
        if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });

        return res.status(200).json(ingredient);
    } catch (err) {
        next(err);
    }
};

// Update an ingredient
exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ingredient id' });

        const { name } = req.body;
        const updated = await Ingredient.update(id, { name });

        if (!updated) return res.status(404).json({ error: 'Ingredient not found' });

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete an ingredient
exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ingredient id' });

        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM pizza_ingredients WHERE ingredient_id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve();
            });
        });

        const deleted = await Ingredient.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Ingredient not found' });

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};