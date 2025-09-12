const db = require('../config/database');

class Pizza {

     // Enlève l'option de dailyPizza à toutes les pizzas
    static unsetDailyPizza(excludeId = null) {
        return new Promise((resolve, reject) => {
            let sql, params;
            if (excludeId) {
                sql = `UPDATE pizzas SET dailyPizza = 0 WHERE dailyPizza = 1 AND id != ?`;
                params = [excludeId]; // exclut la pizza en cours de modification
            } else {
                sql = `UPDATE pizzas SET dailyPizza = 0 WHERE dailyPizza = 1`;
                params = []; // toutes les pizzas du jour passent à 0
            }

            db.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve(this.changes); // retourne le nombre de lignes modifiées
            });
        });
    }

    // Créer une nouvelle pizza
    static async create({ name, description, imageUrl, price, dailyPizza }) {
        // Désactiver toutes les dailyPizza quand la nouvelle pizza est dailyPizza
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
                    // Récupère la pizza qu'on vient d'insérer via son id auto-incrémenté
                    Pizza.findById(this.lastID).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Récupèrer toutes les pizzas en ordre du plus récent au moins récent
    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // Récupèrer une pizza par son id.
    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }


    // Mettre à jour une pizza
    static async update(id, { name, description, imageUrl, price, dailyPizza }) {
        // Désactiver toutes les dailyPizza quand on en rajoute une nouvelle dailyPizza
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
                    if (this.changes === 0) return resolve(null); // aucune pizza trouvée
                    Pizza.findById(id).then(resolve).catch(reject);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    // Supprimer une pizza
    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // nombre de lignes supprimées
            });
        });
    }
}

module.exports = Pizza;