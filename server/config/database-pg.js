const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'planempresa_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

function initializeDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      // Users table with company_name
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          company_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Financial plans table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Plan details table (for storing all the financial parameters)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS plan_details (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          inversion DECIMAL(15,2) DEFAULT 500000,
          cuota_mensual DECIMAL(10,2) DEFAULT 70,
          ingreso_pt DECIMAL(10,2) DEFAULT 0,
          cuota_inscripcion DECIMAL(10,2) DEFAULT 0,
          churn_rate DECIMAL(5,2) DEFAULT 5,
          coste_variable DECIMAL(10,2) DEFAULT 15,
          coste_llave DECIMAL(10,2) DEFAULT 0,
          tasa_morosos DECIMAL(5,2) DEFAULT 0,
          cac DECIMAL(10,2) DEFAULT 50,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // Fixed costs table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS fixed_costs (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          label VARCHAR(255) NOT NULL,
          value DECIMAL(15,2) NOT NULL,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // Create indexes for better performance
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plan_details_plan_id ON plan_details(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_fixed_costs_plan_id ON fixed_costs(plan_id)`);

      console.log('PostgreSQL database initialized successfully');
      resolve();
    } catch (error) {
      console.error('Error initializing PostgreSQL database:', error);
      reject(error);
    }
  });
}

module.exports = {
  pool,
  initializeDatabase
};