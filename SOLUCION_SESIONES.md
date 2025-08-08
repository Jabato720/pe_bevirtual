# Solución para Problema de Sesiones en Producción

## Problemas Identificados y Solucionados:

### 1. ❌ CORS mal configurado
**Antes:** `app.use(cors());` - permitía cualquier origen
**Después:** CORS específico con credenciales:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 2. ❌ JWT_SECRET inseguro
**Antes:** `process.env.JWT_SECRET || 'secretkey'` - fallback inseguro
**Después:** Validación obligatoria de JWT_SECRET

### 3. ❌ Tokens solo en localStorage
**Antes:** Solo headers + localStorage (vulnerable a XSS)
**Después:** Doble capa: headers + cookies httpOnly

### 4. ❌ Configuración de producción faltante
**Antes:** Sin configuración específica para producción
**Después:** baseURL dinámica y withCredentials

## Pasos para Deploy en Producción:

### 1. Variables de Entorno (.env)
```bash
JWT_SECRET=tu_clave_muy_segura_de_al_menos_32_caracteres
NODE_ENV=production
CLIENT_URL=https://tu-dominio.com
PORT=5001
```

### 2. Instalar dependencias nuevas
```bash
cd server
npm install cookie-parser
```

### 3. Build del frontend
```bash
cd client
npm run build
```

### 4. Configurar servidor web (Nginx ejemplo)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        try_files $uri $uri/ @backend;
    }
    
    location @backend {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Mejoras de Seguridad Implementadas:
- ✅ Tokens JWT de 7 días (antes 24h)
- ✅ Cookies httpOnly + secure + sameSite
- ✅ CORS restrictivo con credenciales
- ✅ Validación obligatoria de JWT_SECRET
- ✅ Configuración dinámica dev/prod

### 6. Test de Funcionamiento:
1. Login → Token guardado en localStorage + cookie
2. Refresh página → Sesión mantenida desde localStorage
3. Reinicio navegador → Sesión mantenida desde cookie (si localStorage limpio)
4. Token expirado → Auto-logout y limpieza

## ⚠️ IMPORTANTE para Producción:
- Configurar un JWT_SECRET único y seguro (mínimo 32 caracteres)
- Configurar CLIENT_URL con el dominio real
- Usar HTTPS en producción (las cookies secure lo requieren)
- Configurar backup de base de datos SQLite