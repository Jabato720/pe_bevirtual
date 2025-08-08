const { Pool } = require('pg');

// PostgreSQL connection (Professional Banking Version)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'planempresa_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database (Professional Version)');
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
          company_sector VARCHAR(100),
          logo_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Financial plans table (expanded)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          sector VARCHAR(100),
          status VARCHAR(50) DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Basic financial parameters
      await pool.query(`
        CREATE TABLE IF NOT EXISTS plan_details (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          -- Basic Investment
          inversion DECIMAL(15,2) DEFAULT 500000,
          cuota_mensual DECIMAL(10,2) DEFAULT 70,
          ingreso_pt DECIMAL(10,2) DEFAULT 0,
          cuota_inscripcion DECIMAL(10,2) DEFAULT 0,
          -- Costs & Churn
          churn_rate DECIMAL(5,2) DEFAULT 5,
          coste_variable DECIMAL(10,2) DEFAULT 15,
          coste_llave DECIMAL(10,2) DEFAULT 0,
          tasa_morosos DECIMAL(5,2) DEFAULT 0,
          cac DECIMAL(10,2) DEFAULT 50,
          -- Advanced Financial Metrics
          tir_objetivo DECIMAL(5,2) DEFAULT 15.0,
          van_esperado DECIMAL(15,2) DEFAULT 0,
          payback_meses INTEGER DEFAULT 24,
          margen_ebitda DECIMAL(5,2) DEFAULT 25.0,
          -- Loan Details
          prestamo_principal DECIMAL(15,2) DEFAULT 0,
          prestamo_interes DECIMAL(5,2) DEFAULT 0,
          prestamo_plazo_meses INTEGER DEFAULT 84,
          -- Market Data
          mercado_tam DECIMAL(15,2) DEFAULT 0,
          mercado_sam DECIMAL(15,2) DEFAULT 0,
          mercado_som DECIMAL(15,2) DEFAULT 0,
          competencia_precio_medio DECIMAL(10,2) DEFAULT 65,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // Fixed costs table (unchanged)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS fixed_costs (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          label VARCHAR(255) NOT NULL,
          value DECIMAL(15,2) NOT NULL,
          category VARCHAR(100) DEFAULT 'operational',
          is_confirmed BOOLEAN DEFAULT false,
          notes TEXT,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // NEW: Sensitivity Analysis Scenarios
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sensitivity_scenarios (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          scenario_name VARCHAR(100) NOT NULL,
          scenario_type VARCHAR(50) NOT NULL, -- 'pesimista', 'base', 'optimista'
          adjustment_percentage DECIMAL(5,2) NOT NULL, -- -30, 0, +30
          socios_mes_12 INTEGER,
          break_even_mes INTEGER,
          ebitda_ano_1 DECIMAL(15,2),
          dscr DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // NEW: Banking Guarantees
      await pool.query(`
        CREATE TABLE IF NOT EXISTS banking_guarantees (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          guarantee_type VARCHAR(100) NOT NULL, -- 'real', 'personal', 'operational'
          description VARCHAR(255) NOT NULL,
          value DECIMAL(15,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'proposed', -- 'proposed', 'confirmed', 'rejected'
          documentation_required TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // NEW: Financial Ratios Benchmarking
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sector_benchmarks (
          id SERIAL PRIMARY KEY,
          sector VARCHAR(100) NOT NULL,
          metric_name VARCHAR(100) NOT NULL,
          sector_average DECIMAL(10,2),
          top_quartile DECIMAL(10,2),
          bottom_quartile DECIMAL(10,2),
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // NEW: Monthly Projections (for detailed charts)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS monthly_projections (
          id SERIAL PRIMARY KEY,
          plan_id INTEGER NOT NULL,
          scenario_type VARCHAR(50) DEFAULT 'base',
          month INTEGER NOT NULL,
          nuevos_socios INTEGER,
          total_socios INTEGER,
          ingresos DECIMAL(15,2),
          gastos DECIMAL(15,2),
          ebitda DECIMAL(15,2),
          cash_flow_acumulado DECIMAL(15,2),
          FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
        )
      `);

      // Create indexes for better performance
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_name)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_plan_details_plan_id ON plan_details(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_fixed_costs_plan_id ON fixed_costs(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_sensitivity_plan_id ON sensitivity_scenarios(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_guarantees_plan_id ON banking_guarantees(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_projections_plan_id ON monthly_projections(plan_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_benchmarks_sector ON sector_benchmarks(sector)`);

      // Insert default sector benchmarks
      await pool.query(`
        INSERT INTO sector_benchmarks (sector, metric_name, sector_average, top_quartile, bottom_quartile)
        VALUES 
        ('fitness', 'margen_ebitda', 27.5, 35.0, 20.0),
        ('fitness', 'cac_payback_months', 3.5, 2.0, 5.0),
        ('fitness', 'churn_mensual', 6.0, 3.0, 9.0),
        ('fitness', 'ltv_cac_ratio', 4.0, 8.0, 2.0),
        ('fitness', 'euros_m2_ano', 1000, 1500, 600),
        ('fitness', 'socios_empleado', 175, 250, 100),
        ('fitness', 'break_even_meses', 7.5, 4.0, 12.0),
        ('fitness', 'tir_proyecto', 17.5, 25.0, 10.0)
        ON CONFLICT DO NOTHING
      `);

      console.log('PostgreSQL database initialized successfully (Professional Banking Version)');
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