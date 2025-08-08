# 🚀 Migración SQLite → PostgreSQL Multi-tenant

## ✅ **Cambios Implementados:**

### **1. Backend PostgreSQL**
- ✅ Nueva configuración: `config/database-pg.js`
- ✅ Nuevas rutas: `routes/auth-pg.js`, `routes/plan-pg.js`
- ✅ Nuevo servidor: `index-pg.js`
- ✅ Dependency: `pg` añadida al package.json

### **2. Esquema Multi-tenant**
```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company_name VARCHAR(255) NOT NULL,  -- ⭐ NUEVO
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Resto de tablas sin cambios + indexes para performance
```

### **3. Frontend Actualizado**
- ✅ Register: Añadido campo `company_name`
- ✅ Dashboard: Muestra `user.company_name` en lugar de "RESET FITNESS"
- ✅ Calculator: Muestra nombre empresa dinámico

### **4. Mejoras de Seguridad/Performance**
- ✅ Transacciones PostgreSQL adecuadas
- ✅ Connection pooling con `pg.Pool`
- ✅ Prepared statements contra SQL injection
- ✅ Foreign keys con CASCADE
- ✅ Indexes en columnas críticas

---

## 🛠️ **Para Usar PostgreSQL:**

### **1. Instalar PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows - Descargar desde postgresql.org
```

### **2. Crear Base de Datos**
```bash
# Conectar como usuario postgres
sudo -u postgres psql

# Crear BD y usuario
CREATE DATABASE planempresa_db;
CREATE USER planempresa_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE planempresa_db TO planempresa_user;
\q
```

### **3. Variables de Entorno**
```bash
# server/.env
PORT=5001
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=planempresa_db
DB_USER=planempresa_user
DB_PASSWORD=tu_password_seguro
```

### **4. Instalar Dependencias**
```bash
cd server
npm install pg cookie-parser
```

### **5. Ejecutar con PostgreSQL**
```bash
# En lugar de: npm run dev
node index-pg.js

# O actualizar package.json:
"scripts": {
  "dev": "nodemon index-pg.js",
  "dev-sqlite": "nodemon index.js"
}
```

---

## 🔄 **Arquitectura Multi-Tenant:**

### **Flujo de Usuario:**
```
1. Login: usuario@empresa1.com → 
2. Backend identifica company_name = "Empresa 1"
3. Frontend muestra: "Empresa 1" en cabecera
4. Usuario ve solo SUS planes financieros
5. Datos completamente separados por user_id
```

### **Ejemplo de Usuarios:**
```sql
INSERT INTO users (email, password, name, company_name) VALUES
('admin@resetfitness.com', '$hash', 'Admin', 'Reset Fitness Ibiza'),
('manager@gymadrid.com', '$hash', 'Manager', 'Gym Madrid Centro'),
('owner@fitnessbarcelona.com', '$hash', 'Owner', 'Fitness Barcelona');
```

---

## ⚠️ **Importante:**

**Para mantener SQLite:** Usa `node index.js` (original)
**Para usar PostgreSQL:** Usa `node index-pg.js` (nuevo)

**Los archivos originales NO han sido modificados**, solo añadidos los nuevos con sufijo `-pg`.

---

## 🎯 **Resultado Final:**
- ✅ Una aplicación, múltiples empresas
- ✅ Cada empresa ve solo sus datos  
- ✅ Nombre empresa dinámico en UI
- ✅ Base de datos escalable y robusta
- ✅ Sessions persistentes funcionando
- ✅ Lista para producción multi-tenant

**URL final:** `https://planempresa.devbevirtual.com/`