// Pizza/entities/Pizza.js
const db = require('../config/database');

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
    static async create({ name, description, imageUrl, price, dailyPizza }) {
        // Disable all other dailyPizza entries when the new pizza is set as dailyPizza
        try {
            if (dailyPizza === 1 || dailyPizza === true) {
                await Pizza.unsetDailyPizza();
            }

            const sql = `INSERT INTO pizzas (name, description, imageUrl, price, dailyPizza, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
            const params = [name, description || null, imageUrl || null, price, dailyPizza];

            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) {
                    if (err) return reject(err);
                    Pizza.findById(this.lastID).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Retrieve all pizzas ordered from most recent to oldest
    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // Retrieve a pizza by its id
    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    // Update an existing pizza
    static async update(id, { name, description, imageUrl, price, dailyPizza }) {
        // Disable all other dailyPizza entries when updating one as dailyPizza
        try {
            if (dailyPizza === 1 || dailyPizza === true) {
                await Pizza.unsetDailyPizza(id);
            }

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
                db.run(sql, params, function (err) {
                    if (err) return reject(err);
                    if (this.changes === 0) return resolve(null); // no pizza found
                    Pizza.findById(id).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Delete a pizza
    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Pizza;