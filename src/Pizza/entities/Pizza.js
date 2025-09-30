// Pizza/entities/Pizza.js
const db = require('../../config/database');
const Ingredient = require('../../Ingredients/entities/Ingredient');

class Pizza {

    // Remove the dailyPizza option from all pizzas
    static unsetDailyPizza(excludeId = null) {
        return new Promise((resolve, reject) => {
            let sql, params;
            if (excludeId) {
                sql = `UPDATE pizzas SET dailyPizza = 0 WHERE dailyPizza = 1 AND id != ?`;
                params = [excludeId];
            } else {
                sql = `UPDATE pizzas SET dailyPizza = 0 WHERE dailyPizza = 1`;
                params = [];
            }

            db.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }

    // Create a new pizza
    static async create({ name, description, imageUrl, price, dailyPizza, ingredients = [] }) {
        try {
            if (dailyPizza) await Pizza.unsetDailyPizza();

            const sql = `
                INSERT INTO pizzas (name, description, imageUrl, price, dailyPizza, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `;
            const params = [name, description || null, imageUrl || null, price, dailyPizza || 0];

            return new Promise((resolve, reject) => {
                db.run(sql, params, async function(err) {
                    if (err) return reject(err);
                    const pizzaId = this.lastID;

                    // Add existing ingredients only
                    for (const ingId of ingredients) {
                        const ing = await Ingredient.findById(ingId);
                        if (ing) await Pizza.addIngredient(pizzaId, ingId);
                    }

                    Pizza.findById(pizzaId).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Retrieve a pizza by its id including ingredients
    static async findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], async (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);

                const ingSql = `
                    SELECT pi.ingredient_id, i.name
                    FROM pizza_ingredients pi
                             JOIN ingredients i ON i.id = pi.ingredient_id
                    WHERE pi.pizza_id = ?
                `;
                db.all(ingSql, [id], (err2, rows) => {
                    if (err2) return reject(err2);
                    row.ingredients = rows.map(r => ({ id: r.ingredient_id, name: r.name }));
                    resolve(row);
                });
            });
        });
    }

    // Retrieve all pizzas with ingredients
    static async findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], async (err, rows) => {
                if (err) return reject(err);

                const pizzas = await Promise.all(
                    rows.map(row => Pizza.findById(row.id))
                );
                resolve(pizzas);
            });
        });
    }

    // Update an existing pizza
    static async update(id, { name, description, imageUrl, price, dailyPizza, ingredients }) {
        try {
            if (dailyPizza) await Pizza.unsetDailyPizza(id);

            const sql = `
                UPDATE pizzas
                SET name = COALESCE(?, name),
                    description = COALESCE(?, description),
                    imageUrl = COALESCE(?, imageUrl),
                    price = COALESCE(?, price),
                    dailyPizza = COALESCE(?, dailyPizza),
                    updated_at = datetime('now')
                WHERE id = ?
            `;
            const params = [name, description, imageUrl, price, dailyPizza, id];

            return new Promise((resolve, reject) => {
                db.run(sql, params, async function(err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return resolve(null);

                    // Update ingredients if provided
                    if (Array.isArray(ingredients)) {
                        // Remove old ingredients
                        await new Promise((res, rej) => {
                            db.run(`DELETE FROM pizza_ingredients WHERE pizza_id = ?`, [id], (err) => {
                                if (err) return rej(err);
                                res();
                            });
                        });
                        // Add new ingredients
                        for (const ingId of ingredients) {
                            const ing = await Ingredient.findById(ingId);
                            if (ing) await Pizza.addIngredient(id, ingId);
                        }
                    }

                    Pizza.findById(id).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Delete a pizza
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM pizzas WHERE id = ?`, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }

    // Add an ingredient to a pizza
    static async addIngredient(pizzaId, ingredientId) {
        const pizza = await Pizza.findById(pizzaId);
        const ing = await Ingredient.findById(ingredientId);
        if (!pizza) throw new Error("Pizza not found");
        if (!ing) throw new Error("Ingredient not found");

        const sql = `INSERT OR IGNORE INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], async function(err) {
                if (err) return reject(err);
                const updatedPizza = await Pizza.findById(pizzaId);
                resolve(updatedPizza);
            });
        });
    }
}

module.exports = Pizza;