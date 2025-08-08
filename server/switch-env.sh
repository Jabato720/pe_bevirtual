#!/bin/bash

# Script para cambiar entre entornos local y producción

if [ "$1" = "local" ]; then
    echo "🔄 Cambiando a entorno LOCAL..."
    cp .env.local .env
    echo "✅ Configuración local activada"
    echo "📍 Base de datos: localhost:5432/planempresa_db"
elif [ "$1" = "production" ]; then
    echo "🔄 Cambiando a entorno PRODUCCIÓN..."
    cp .env.production .env
    echo "✅ Configuración de producción activada"
    echo "📍 Base de datos: 49.13.8.210:5432/postgres"
else
    echo "Uso: ./switch-env.sh [local|production]"
    echo ""
    echo "Ejemplos:"
    echo "  ./switch-env.sh local       # Para desarrollo local"
    echo "  ./switch-env.sh production  # Para conectar al VPS"
fi