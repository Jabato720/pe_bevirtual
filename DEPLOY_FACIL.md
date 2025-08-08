# 🚀 Deploy Fácil en 5 Minutos

## Opción Recomendada: Vercel (GRATIS)

### Paso 1: Preparar el proyecto
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. En la carpeta del proyecto
cd appPlanFinanciero
npm install
```

### Paso 2: Configurar variables de entorno
Crear archivo `.env` en la raíz:
```bash
JWT_SECRET=mi_clave_super_secreta_de_32_caracteres_minimo
NODE_ENV=production
```

### Paso 3: Deploy
```bash
# En la terminal, dentro de appPlanFinanciero/
vercel

# Sigue las preguntas:
# - Set up and deploy? Y
# - Which scope? tu-usuario
# - Link to existing project? N  
# - Project name? plan-financiero
# - In which directory is your code located? ./
```

### Paso 4: Configurar variables en Vercel Dashboard
1. Ve a https://vercel.com/dashboard
2. Encuentra tu proyecto
3. Settings → Environment Variables
4. Añade:
   - `JWT_SECRET`: tu_clave_secreta
   - `NODE_ENV`: production

---

## Alternativa: Railway (También Gratis)

### Paso 1: Conectar GitHub
1. Sube tu código a GitHub
2. Ve a https://railway.app
3. "Deploy from GitHub"
4. Selecciona tu repositorio

### Paso 2: Configurar Variables
En Railway dashboard:
- Add Variable: `JWT_SECRET` = tu_clave_secreta
- Add Variable: `NODE_ENV` = production

---

## ❌ ¿Por qué no FTP tradicional?

Tu aplicación es **Full-Stack Node.js**, no solo archivos estáticos:

| Necesita | FTP Tradicional | Vercel/Railway |
|----------|-----------------|----------------|
| Ejecutar Node.js | ❌ | ✅ |
| Base de datos | ❌ | ✅ |
| Variables de entorno | ❌ | ✅ |
| Instalar dependencias | ❌ | ✅ |
| Proceso permanente | ❌ | ✅ |

---

## 🎯 Resultado Final:
- ✅ Tu app funcionará en: `https://tu-proyecto.vercel.app`
- ✅ Base de datos SQLite incluida
- ✅ Sesiones persistentes
- ✅ Certificado SSL automático
- ✅ Deploy automático en cada push

**Tiempo total: 5-10 minutos máximo** 🕐