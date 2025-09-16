const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'dev.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Initialize pizza_ingredients junction table if not exists
const initSql = `
    CREATE TABLE IF NOT EXISTS pizza_ingredients (
        pizza_id INTEGER NOT NULL,
        ingredient_id INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        PRIMARY KEY (pizza_id, ingredient_id),
        FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );
`;

db.serialize(() => {
    db.run(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize pizza_ingredients table', err);
            process.exit(1);
        }
    });
});

module.exports = db;
