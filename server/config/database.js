const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'financiero.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Financial plans table
    db.run(`
      CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Plan details table (for storing all the financial parameters)
    db.run(`
      CREATE TABLE IF NOT EXISTS plan_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        inversion REAL DEFAULT 500000,
        cuota_mensual REAL DEFAULT 70,
        ingreso_pt REAL DEFAULT 0,
        cuota_inscripcion REAL DEFAULT 0,
        churn_rate REAL DEFAULT 5,
        coste_variable REAL DEFAULT 15,
        coste_llave REAL DEFAULT 0,
        tasa_morosos REAL DEFAULT 0,
        cac REAL DEFAULT 50,
        FOREIGN KEY (plan_id) REFERENCES plans(id)
      )
    `);

    // Fixed costs table
    db.run(`
      CREATE TABLE IF NOT EXISTS fixed_costs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        label TEXT NOT NULL,
        value REAL NOT NULL,
        FOREIGN KEY (plan_id) REFERENCES plans(id)
      )
    `);
  });

  console.log('Database initialized');
}

module.exports = {
  db,
  initializeDatabase
};
