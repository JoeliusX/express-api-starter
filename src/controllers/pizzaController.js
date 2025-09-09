// controllers/pizzaController.js
const { validationResult } = require('express-validator');
const Pizza = require('../entities/Pizza');

/**
 * Controller functions use Express (req, res) signatures and
 * respond with status codes matching MDN/HTTP recommendations.
 */

exports.create = async (req, res, next) => {
    try {
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // 400 Bad Request for validation problems
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, imageUrl, price } = req.body;
        const created = await Pizza.create({ name, description, imageUrl, price });
        // 201 Created
        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const pizzas = await Pizza.findAll();
        // 200 OK
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const pizza = await Pizza.findById(id);
        if (!pizza) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const { name, description, imageUrl, price } = req.body;
        const updated = await Pizza.update(id, { name, description, imageUrl, price });
        if (!updated) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid pizza id' });

        const deleted = await Pizza.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Pizza not found' });

        // 204 No Content on successful delete
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
