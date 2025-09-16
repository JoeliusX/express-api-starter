const db = require('../config/database');

class PizzaIngredient {

    // Ajouter un ingrédient à une pizza
    static addIngredient(pizzaId, ingredientId) {
        const sql = `INSERT INTO pizza_ingredients (pizza_id, ingredient_id, created_at) VALUES (?, ?, datetime('now'))`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve({ pizzaId, ingredientId });
            });
        });
    }

    // Retirer un ingrédient d'une pizza
    static removeIngredient(pizzaId, ingredientId) {
        const sql = `DELETE FROM pizza_ingredients WHERE pizza_id = ? AND ingredient_id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // retourne le nombre de lignes supprimées
            });
        });
    }

    // Récupérer tous les ingrédients d'une pizza
    static getIngredientsByPizza(pizzaId) {
        const sql = `
            SELECT i.*
            FROM ingredients i
                     INNER JOIN pizza_ingredients pi ON i.id = pi.ingredient_id
            WHERE pi.pizza_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [pizzaId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // Récupérer toutes les pizzas contenant un ingrédient
    static getPizzasByIngredient(ingredientId) {
        const sql = `
            SELECT p.*
            FROM pizzas p
                     INNER JOIN pizza_ingredients pi ON p.id = pi.pizza_id
            WHERE pi.ingredient_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [ingredientId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = PizzaIngredient;
