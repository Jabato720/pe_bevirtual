#!/bin/bash

# Script de Deploy para Plan Financiero
# Uso: ./deploy.sh

echo "🚀 Iniciando proceso de deploy..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
PROJECT_NAME="plan-financiero"
CLIENT_DIR="client"
SERVER_DIR="server"
DIST_DIR="dist"
BUILD_DIR="build"

# Función para mostrar errores
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Función para mostrar éxito
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
warning_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Paso 1: Verificar que estamos en el directorio correcto
if [ ! -d "$CLIENT_DIR" ] || [ ! -d "$SERVER_DIR" ]; then
    error_exit "No se encontraron las carpetas client y server. Ejecuta este script desde la raíz del proyecto."
fi

# Paso 2: Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf "$CLIENT_DIR/$DIST_DIR"
rm -rf "$BUILD_DIR"
success_msg "Builds anteriores limpiados"

# Paso 3: Instalar dependencias del cliente
echo "📦 Instalando dependencias del cliente..."
cd "$CLIENT_DIR" || error_exit "No se pudo acceder al directorio client"
npm install || error_exit "Error al instalar dependencias del cliente"
success_msg "Dependencias del cliente instaladas"

# Paso 4: Build del cliente
echo "🏗️  Construyendo aplicación cliente..."
npm run build || error_exit "Error al construir el cliente"
success_msg "Cliente construido exitosamente"

# Paso 5: Volver al directorio raíz
cd .. || error_exit "No se pudo volver al directorio raíz"

# Paso 6: Instalar dependencias del servidor
echo "🖥️  Instalando dependencias del servidor..."
cd "$SERVER_DIR" || error_exit "No se pudo acceder al directorio server"
npm install || error_exit "Error al instalar dependencias del servidor"
success_msg "Dependencias del servidor instaladas"

# Paso 7: Crear directorio de build
cd .. || error_exit "No se pudo volver al directorio raíz"
mkdir -p "$BUILD_DIR"

# Paso 8: Copiar archivos necesarios
echo "📁 Copiando archivos para producción..."

# Copiar cliente construido
cp -r "$CLIENT_DIR/$DIST_DIR" "$BUILD_DIR/public"
success_msg "Cliente copiado a build/public"

# Copiar servidor
cp -r "$SERVER_DIR"/* "$BUILD_DIR/"
success_msg "Servidor copiado a build"

# Paso 9: Crear package.json para producción
echo "📄 Creando package.json para producción..."
cat > "$BUILD_DIR/package.json" << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "Plan Financiero - Aplicación de análisis financiero para gimnasios",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "sqlite3": "^5.1.6"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF
success_msg "package.json creado"

# Paso 10: Actualizar rutas en index.js para servir archivos estáticos
echo "🔧 Configurando servidor para producción..."
sed -i.bak "s|path.join(__dirname, '../client/dist')|path.join(__dirname, 'public')|g" "$BUILD_DIR/index.js"
sed -i.bak "s|path.resolve(__dirname, '../client', 'dist', 'index.html')|path.resolve(__dirname, 'public', 'index.html')|g" "$BUILD_DIR/index.js"
rm "$BUILD_DIR/index.js.bak" 2>/dev/null || true
success_msg "Configuración de servidor actualizada"

# Paso 11: Crear archivo .htaccess para Apache (si es necesario)
cat > "$BUILD_DIR/.htaccess" << EOF
# Apache configuration for SPA
RewriteEngine On
RewriteRule ^api/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
EOF

# Paso 12: Crear archivo de instrucciones
cat > "$BUILD_DIR/DEPLOY_INSTRUCTIONS.md" << EOF
# Instrucciones de Deploy

## Archivos a subir por FTP:
- Todo el contenido de esta carpeta (build/)

## Configuración del servidor:
1. Asegúrate de que Node.js esté instalado (versión 18 o superior)
2. Ejecuta: \`npm install\`
3. Ejecuta: \`npm start\`

## Variables de entorno necesarias:
- PORT: Puerto del servidor (por defecto 5001)
- JWT_SECRET: Clave secreta para JWT
- NODE_ENV: production
- DATABASE_PATH: Ruta a la base de datos SQLite

## Estructura de archivos:
- \`public/\`: Archivos estáticos del cliente (React)
- \`index.js\`: Servidor Express
- \`config/\`: Configuración de la base de datos
- \`routes/\`: Rutas de la API
- \`data/\`: Base de datos SQLite

## URL de acceso:
- Frontend: http://tu-dominio.com/
- API: http://tu-dominio.com/api/

## Comandos útiles:
- Iniciar servidor: \`npm start\`
- Logs: \`tail -f logs/app.log\` (si está configurado)
- Reiniciar: \`pm2 restart all\` (si usas PM2)
EOF

success_msg "Instrucciones de deploy creadas"

# Paso 13: Mostrar resumen
echo ""
echo "🎉 ¡Deploy preparado exitosamente!"
echo ""
echo "📁 Archivos listos en la carpeta: $BUILD_DIR/"
echo ""
echo "📋 Próximos pasos:"
echo "1. Comprimir la carpeta $BUILD_DIR/ en un ZIP"
echo "2. Subir por FTP todo el contenido a tu servidor"
echo "3. En el servidor, ejecutar: npm install"
echo "4. Configurar variables de entorno si es necesario"
echo "5. Ejecutar: npm start"
echo ""
echo "📊 Estadísticas del build:"
echo "- Tamaño del cliente: $(du -sh $BUILD_DIR/public 2>/dev/null | cut -f1)"
echo "- Archivos totales: $(find $BUILD_DIR -type f | wc -l)"
echo ""
warning_msg "Recuerda cambiar las variables de entorno en el servidor"
echo ""