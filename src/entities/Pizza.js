// entities/Pizza.js
const db = require('../config/database');

class Pizza {
    static create({ name, description, imageUrl, price, dailyPizza }) {
        const sql = `INSERT INTO pizzas (name, description, imageUrl, price, dailyPizza, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
        const params = [name, description || null, imageUrl || null, price, dailyPizza];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                Pizza.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }

    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name, description, imageUrl, price, dailyPizza }) {
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
                if (this.changes === 0) return resolve(null);
                Pizza.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = Pizza;
