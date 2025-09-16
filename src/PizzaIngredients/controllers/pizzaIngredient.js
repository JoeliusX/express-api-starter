const PizzaIngredient = require('../entities/pizzaIngredient');

// Ajouter un ingrédient à une pizza
exports.addIngredient = async (req, res, next) => {
    try {
        const pizzaId = Number(req.params.pizzaId);
        const { ingredientId } = req.body;

        const added = await PizzaIngredient.addIngredient(pizzaId, ingredientId);
        return res.status(201).json(added);
    } catch (err) {
        next(err);
    }
};

// Retirer un ingrédient d'une pizza
exports.removeIngredient = async (req, res, next) => {
    try {
        const pizzaId = Number(req.params.pizzaId);
        const ingredientId = Number(req.params.ingredientId);

        const removed = await PizzaIngredient.removeIngredient(pizzaId, ingredientId);
        if (removed === 0) return res.status(404).json({ error: "Relation not found" });

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// Récupérer tous les ingrédients d'une pizza
exports.getIngredientsByPizza = async (req, res, next) => {
    try {
        const pizzaId = Number(req.params.pizzaId);
        if (Number.isNaN(pizzaId)) return res.status(400).json({ error: "Invalid pizza id" });

        const ingredients = await PizzaIngredient.getIngredientsByPizza(pizzaId);
        return res.status(200).json(ingredients);
    } catch (err) {
        next(err);
    }
};

// Récupérer toutes les pizzas contenant un ingrédient
exports.getPizzasByIngredient = async (req, res, next) => {
    try {
        const ingredientId = Number(req.params.ingredientId);
        if (Number.isNaN(ingredientId)) return res.status(400).json({ error: "Invalid ingredient id" });

        const pizzas = await PizzaIngredient.getPizzasByIngredient(ingredientId);
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};
