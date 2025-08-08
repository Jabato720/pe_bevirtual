#!/bin/bash

echo "🚀 Inicializando PostgreSQL local para desarrollo..."

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado. Por favor, instálalo primero con:"
    echo "   brew install postgresql@16"
    exit 1
fi

# Verificar si el servicio está corriendo
if ! pg_isready -q; then
    echo "⚠️ PostgreSQL no está corriendo. Iniciando servicio..."
    brew services start postgresql@16
    sleep 3
fi

# Crear base de datos si no existe
echo "📦 Creando base de datos 'planempresa_db'..."
createdb planempresa_db 2>/dev/null || echo "✓ La base de datos ya existe"

# Cambiar a configuración local
echo "🔄 Activando configuración local..."
cp .env.local .env

echo ""
echo "✅ PostgreSQL local configurado correctamente!"
echo ""
echo "📊 Información de conexión:"
echo "   Host: localhost"
echo "   Puerto: 5432"
echo "   Base de datos: planempresa_db"
echo "   Usuario: $(whoami)"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   node index-pg.js"
echo ""
echo "💡 Para cambiar entre local y producción:"
echo "   ./switch-env.sh local       # Para desarrollo local"
echo "   ./switch-env.sh production  # Para conectar al VPS"