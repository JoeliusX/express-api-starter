// Ingredients/entities/Ingredient.js
const db = require('../config/database');

class Ingredient {

    // Create a new ingredient
    static async create({ name }) {
        const sql = `INSERT INTO ingredients (name, created_at, updated_at)
                     VALUES (?, datetime('now'), datetime('now'))`;
        const params = [name];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                Ingredient.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }

    // Retrieve all ingredients ordered from most recent to oldest
    static findAll() {
        const sql = `SELECT * FROM ingredients ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // Retrieve an ingredient by its id
    static findById(id) {
        const sql = `SELECT * FROM ingredients WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    // Update an existing ingredient
    static async update(id, { name }) {
        const sql = `
            UPDATE ingredients
            SET name = COALESCE(?, name),
            WHERE id = ?
        `;
        const params = [name, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null); // no ingredient found
                Ingredient.findById(id).then(resolve).catch(reject);
            });
        });

}

    // Delete a ingredient
    static delete(id) {
        const sql = `DELETE FROM ingredients WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Ingredient;