// BASE DE DATOS PROFESIONAL - MODELOS DE NEGOCIO OPERACIONALES REALES
// Transformado de académico a nivel Excel bancario profesional

export const businessModelsProfessional = {
  // GIMNASIO/FITNESS - MODELO PROFESIONAL COMPLETO
  "gimnasio-fitness": {
    id: "gimnasio-fitness",
    nombre: "Gimnasio/Centro Fitness",
    sector: "Deporte/Fitness",
    categoria_inversion: "media",
    inversion_min: 80000,
    inversion_max: 150000,
    inversion_promedio: 115000,
    description: "Centro fitness completo con gestión operacional profesional y múltiples fuentes de ingresos",
    
    // ITEMS CON DETALLES OPERACIONALES REALES
    items_obligatorios: [
      { id: "acondicionamiento-local", nombre: "Acondicionamiento local", categoria: "infraestructura", precio_estimado: 25000 },
      { id: "equipamiento-cardio", nombre: "Equipamiento cardio", categoria: "equipamiento", precio_estimado: 30000 },
      { id: "equipamiento-musculacion", nombre: "Equipamiento musculación", categoria: "equipamiento", precio_estimado: 35000 },
      { id: "vestuarios-duchas", nombre: "Vestuarios y duchas", categoria: "infraestructura", precio_estimado: 12000 },
      { id: "sistema-gestion", nombre: "Software gestión socios", categoria: "tecnologia", precio_estimado: 2000 },
      { id: "sonido-climatizacion", nombre: "Sistema sonido + climatización", categoria: "infraestructura", precio_estimado: 6000 },
      { id: "leasing-material", nombre: "Leasing material fitness", categoria: "equipamiento", precio_estimado: 0, tipo: 'leasing_mensual', coste_mensual: 1500 },
      { id: "licencias-sgae", nombre: "Licencias SGAE/Les Mills", categoria: "legal", precio_estimado: 341, frecuencia: 'mensual' },
      { id: "seguros-responsabilidad", nombre: "Seguros responsabilidad civil", categoria: "legal", precio_estimado: 1500 },
      { id: "licencias-apertura", nombre: "Licencias de apertura", categoria: "legal", precio_estimado: 2000 },
      { id: "marketing-apertura", nombre: "Campaña marketing apertura", categoria: "marketing", precio_estimado: 3000 }
    ],
    
    // GASTOS MENSUALES OPERACIONALES DETALLADOS (EXACTO EXCEL 8,548€)
    gastos_mensuales_detallados: {
      // COSTES FIJOS MENSUALES = 8,548€ exacto
      suministros: 1800, // Luz, agua, gas
      seguros: 100,
      gestoria: 200,
      mantenimiento: 800,
      licencias_musica: 341,
      publicidad: 500,
      otros_operativos: 1000,
      servicios_profesionales: 3807, // Ajuste para llegar a 8,548€
      
      // COSTES ESPECIALES (NO EN BASE 8,548€)
      alquiler: { base: 3000, carencia_meses: 2 }, // Con carencia
      personal: { base: 0, escalado: [0, 815, 1630, 2445] }, // Escalado por trimestre
      leasing_equipos: 1500, // Separado de costes base
      publicidad_inicial: 10000 // Pre-apertura una vez
    },
    
    // MÚLTIPLES FUENTES DE INGRESOS (REAL)
    revenue_streams: {
      cuota_mensual: { 
        precio_base: 45, 
        rango: [35, 60],
        descripcion: "Cuota mensual base por socio" 
      },
      matricula: { 
        precio: 50, 
        aplicable: 'nuevos_clientes',
        descripcion: "Matrícula una vez por cliente nuevo"
      },
      personal_training: { 
        precio_sesion: 25, 
        sesiones_mes_promedio: 4,
        aplicable: '25%_clientes',
        descripcion: "Personal training adicional"
      },
      llaves_tarjetas: { 
        precio: 11, 
        aplicable: 'nuevos_clientes',
        descripcion: "Llaves y tarjetas de acceso"
      },
      tarifas_especiales: { 
        descuento: 0.15, 
        aplicable: 'estudiantes_seniors',
        porcentaje_clientes: 0.20,
        descripcion: "Descuentos estudiantes y seniors"
      }
    },
    
    // GESTIÓN DE CLIENTES OPERACIONAL
    customer_management: {
      crecimiento_mensual_promedio: 95, // Clientes nuevos por mes
      tasa_abandono_mensual: 0.08, // 8% churn mensual
      estacionalidad: {
        enero: 1.4,    // Efecto enero gimnasio (+40%)
        febrero: 1.2,  // Continuación efecto enero  
        marzo: 1.0,    // Normalización
        abril: 0.9,    // Bajada pre-verano
        mayo: 0.8,     // Preparación verano
        junio: 0.7,    // Inicio vacaciones
        julio: 0.6,    // Vacaciones plenas
        agosto: 0.5,   // Mínimo del año (-50%)
        septiembre: 1.3, // Vuelta vacaciones (+30%)
        octubre: 1.1,  // Estabilización otoño
        noviembre: 0.9, // Pre-navidades
        diciembre: 0.8  // Navidades
      },
      periodo_permanencia_promedio: 14, // meses
      conversion_prueba_gratuita: 0.25, // 25% conversión
      clientes_objetivo_ano1: 710 // Meta año 1 (real del Excel)
    },
    
    // KPIs OPERACIONALES (NO SOLO FINANCIEROS)
    operational_kpis: {
      ingresos_por_cliente: { target: 45, benchmark_sector: 42, critical: 30 },
      tasa_retencion: { target: 0.75, benchmark_sector: 0.70, critical: 0.60 },
      clientes_por_m2: { target: 3, benchmark_sector: 2.8, critical: 2 },
      ocupacion_promedio: { target: 0.70, benchmark_sector: 0.65, critical: 0.50 },
      conversion_prueba_gratuita: { target: 0.30, benchmark_sector: 0.25, critical: 0.15 },
      margen_ebitda: { target: 0.25, benchmark_sector: 0.22, critical: 0.15 }
    },
    
    // ASPECTOS TEMPORALES ESPECÍFICOS
    aspectos_temporales: {
      carencia_alquiler: 2, // meses sin pagar alquiler
      pre_ventas_apertura: 105, // clientes antes de apertura
      ramp_up_meses: 6, // meses para capacidad normal
      capacidad_maxima: 1200, // clientes máximos
      factor_ramp_up: 0.3 // Factor inicial capacidad
    }
  },
  
  // RESTAURANTE - MODELO PROFESIONAL COMPLETO
  "restaurante": {
    id: "restaurante",
    nombre: "Restaurante/Bar",
    sector: "Restauración",
    categoria_inversion: "media",
    inversion_min: 60000,
    inversion_max: 150000,
    inversion_promedio: 105000,
    description: "Restaurante con gestión operacional completa y múltiples fuentes de ingresos",
    
    items_obligatorios: [
      { id: "local-acondicionamiento", nombre: "Local + acondicionamiento", categoria: "infraestructura", precio_estimado: 35000 },
      { id: "equipamiento-cocina", nombre: "Equipamiento cocina profesional", categoria: "equipamiento", precio_estimado: 25000 },
      { id: "mobiliario-decoracion", nombre: "Mobiliario y decoración", categoria: "infraestructura", precio_estimado: 15000 },
      { id: "licencias-permisos", nombre: "Licencias y permisos", categoria: "legal", precio_estimado: 3000 },
      { id: "stock-inicial", nombre: "Stock inicial alimentos/bebidas", categoria: "stock", precio_estimado: 8000 },
      { id: "sistema-pos", nombre: "Sistema POS + software gestión", categoria: "tecnologia", precio_estimado: 2500 },
      { id: "marketing-apertura", nombre: "Marketing apertura", categoria: "marketing", precio_estimado: 4000 },
      { id: "seguros-locales", nombre: "Seguros locales comerciales", categoria: "legal", precio_estimado: 1200 },
      { id: "uniformes-menaje", nombre: "Uniformes y menaje", categoria: "operativo", precio_estimado: 2000 },
      { id: "capital-trabajo", nombre: "Capital de trabajo inicial", categoria: "operativo", precio_estimado: 9300 }
    ],
    
    gastos_mensuales_detallados: {
      alquiler: 3500,
      personal: { base: 6000, variable_por_ventas: 0.15 },
      materias_primas: { base: 2000, porcentaje_ventas: 0.32 },
      suministros: 1200,
      seguros: 100,
      gestoria: 150,
      marketing: 600,
      mantenimiento: 400,
      otros_operativos: 500
    },
    
    revenue_streams: {
      ventas_comida: {
        calculo: 'comensales_x_ticket_medio',
        ticket_medio_base: 25,
        rango: [18, 35],
        descripcion: "Ventas principales de comida"
      },
      bebidas: {
        margen: 0.65,
        porcentaje_ventas_comida: 0.40,
        descripcion: "Bebidas alcohólicas y refrescos"
      },
      menus_especiales: {
        precio_rango: [15, 35],
        frecuencia_semanal: 2,
        clientes_promedio: 15,
        descripcion: "Menús del día y especiales"
      },
      catering: {
        calculo: 'eventos_x_precio',
        eventos_mes: 2,
        precio_promedio_evento: 800,
        descripcion: "Servicios de catering externos"
      }
    },
    
    customer_management: {
      comensales_dia_promedio: 45,
      rotacion_mesas: 2.5,
      estacionalidad: {
        enero: 0.8,   // Post-navidades bajo
        febrero: 0.9, // Recuperación lenta
        marzo: 1.0,   // Normalización
        abril: 1.1,   // Buen tiempo
        mayo: 1.2,    // Terrazas
        junio: 1.3,   // Turismo inicial
        julio: 1.4,   // Pico verano
        agosto: 1.3,  // Vacaciones locales
        septiembre: 1.1, // Vuelta normalidad
        octubre: 1.0, // Estabilidad
        noviembre: 1.2, // Pre-navidades
        diciembre: 1.5  // Navidades (+50%)
      },
      conversion_reservas: 0.85,
      clientes_repetidores: 0.60
    },
    
    operational_kpis: {
      ticket_medio: { target: 25, benchmark_sector: 23, critical: 15 },
      rotacion_mesas: { target: 3, benchmark_sector: 2.5, critical: 2 },
      coste_por_plato: { target: 0.30, benchmark_sector: 0.32, critical: 0.40 },
      ocupacion_promedio: { target: 0.75, benchmark_sector: 0.70, critical: 0.50 },
      margen_bebidas: { target: 0.65, benchmark_sector: 0.60, critical: 0.50 },
      satisfaccion_cliente: { target: 4.5, benchmark_sector: 4.2, critical: 3.8 }
    },
    
    aspectos_temporales: {
      obras_acondicionamiento: 3,
      periodo_pruebas: 1,
      ramp_up: { meses: 4, factor_inicial: 0.4 },
      capacidad_maxima: { comensales_dia: 120, mesas: 25 }
    }
  },

  // E-COMMERCE - MODELO PROFESIONAL COMPLETO
  "ecommerce-profesional": {
    id: "ecommerce-profesional",
    nombre: "E-commerce Profesional",
    sector: "Digital/E-commerce",
    categoria_inversion: "baja",
    inversion_min: 15000,
    inversion_max: 50000,
    inversion_promedio: 32500,
    description: "E-commerce profesional con gestión operacional avanzada y múltiples canales",
    
    items_obligatorios: [
      { id: "plataforma-avanzada", nombre: "Plataforma e-commerce avanzada", categoria: "tecnologia", precio_estimado: 4000 },
      { id: "hosting-cdn", nombre: "Hosting premium + CDN", categoria: "tecnologia", precio_estimado: 600 },
      { id: "inventario-inicial", nombre: "Inventario inicial", categoria: "stock", precio_estimado: 15000 },
      { id: "diseno-ux", nombre: "Diseño UX/UI profesional", categoria: "marketing", precio_estimado: 3500 },
      { id: "marketing-digital", nombre: "Marketing digital + SEM/SEO", categoria: "marketing", precio_estimado: 5000 },
      { id: "logistica", nombre: "Sistema logística", categoria: "operativo", precio_estimado: 2000 },
      { id: "fotografia", nombre: "Fotografía profesional", categoria: "marketing", precio_estimado: 1500 },
      { id: "integraciones", nombre: "Integraciones ERP/CRM", categoria: "tecnologia", precio_estimado: 2000 },
      { id: "seguros-digitales", nombre: "Seguros digitales", categoria: "legal", precio_estimado: 500 },
      { id: "herramientas-analytics", nombre: "Analytics y herramientas", categoria: "tecnologia", precio_estimado: 800 }
    ],
    
    gastos_mensuales_detallados: {
      hosting: 150,
      marketing_digital: { base: 2000, porcentaje_ventas: 0.08 },
      logistica: { base: 500, por_pedido: 3.5 },
      personal: 2500,
      herramientas_digitales: 200,
      devolucioes_garantias: { porcentaje_ventas: 0.02 },
      otros_operativos: 300
    },
    
    revenue_streams: {
      ventas_productos: {
        calculo: 'visitas_x_conversion_x_aov',
        conversion_rate_base: 0.025,
        aov_base: 65,
        descripcion: "Ventas principales de productos"
      },
      envios: {
        precio_envio: 4.95,
        porcentaje_pedidos_cobrado: 0.70,
        descripcion: "Ingresos por envíos"
      },
      marketplace: {
        comision: 0.15,
        porcentaje_ventas: 0.30,
        descripcion: "Ventas en marketplaces (Amazon, etc.)"
      },
      suscripciones_premium: {
        precio_mensual: 9.99,
        conversion_clientes: 0.05,
        descripcion: "Membresías premium"
      }
    },
    
    customer_management: {
      visitas_mes_inicial: 5000,
      crecimiento_visitas_mensual: 0.15,
      estacionalidad: {
        enero: 0.9,   // Post-navidades
        febrero: 0.9, // Bajada
        marzo: 1.0,   // Normalización
        abril: 1.0,   // Estable
        mayo: 1.0,    // Estable
        junio: 1.1,   // Inicio verano
        julio: 1.1,   // Verano
        agosto: 1.0,  // Vacaciones
        septiembre: 1.0, // Vuelta
        octubre: 1.1, // Pre-Black Friday
        noviembre: 1.4, // Black Friday (+40%)
        diciembre: 1.8  // Navidades (+80%)
      },
      tasa_retencion: 0.35,
      ltv_promedio: 180,
      cac_organico: 15,
      cac_pago: 35
    },
    
    operational_kpis: {
      conversion_rate: { target: 0.030, benchmark_sector: 0.025, critical: 0.015 },
      aov: { target: 70, benchmark_sector: 65, critical: 45 },
      cac_ltv_ratio: { target: 0.20, benchmark_sector: 0.25, critical: 0.35 },
      tiempo_carga: { target: 2.5, benchmark_sector: 3.0, critical: 4.0 },
      tasa_abandono_carrito: { target: 0.65, benchmark_sector: 0.70, critical: 0.80 },
      satisfaccion_cliente: { target: 4.6, benchmark_sector: 4.3, critical: 4.0 }
    },
    
    aspectos_temporales: {
      desarrollo_plataforma: 2,
      periodo_testing: 1,
      ramp_up: { meses: 6, factor_inicial: 0.25 },
      picos_estacionales: ['black-friday', 'navidades']
    }
  },

  // HOTEL RURAL - MODELO PROFESIONAL COMPLETO
  "hotel-rural": {
    id: "hotel-rural",
    nombre: "Hotel Rural/Turismo Rural",
    sector: "Turismo/Hostelería",
    categoria_inversion: "muy-alta",
    inversion_min: 500000,
    inversion_max: 1200000,
    inversion_promedio: 850000,
    description: "Hotel rural con gestión operacional completa y servicios integrados",
    
    items_obligatorios: [
      { id: "adquisicion-reforma", nombre: "Adquisición/reforma edificio", categoria: "infraestructura", precio_estimado: 400000 },
      { id: "mobiliario-habitaciones", nombre: "Mobiliario habitaciones", categoria: "infraestructura", precio_estimado: 80000 },
      { id: "equipamiento-cocina", nombre: "Equipamiento cocina profesional", categoria: "equipamiento", precio_estimado: 50000 },
      { id: "equipamiento-hotel", nombre: "Equipamiento hotelero", categoria: "equipamiento", precio_estimado: 60000 },
      { id: "sistema-gestion-hotel", nombre: "Sistema gestión hotelera", categoria: "tecnologia", precio_estimado: 15000 },
      { id: "licencias-turisticas", nombre: "Licencias turísticas", categoria: "legal", precio_estimado: 25000 },
      { id: "marketing-turistico", nombre: "Marketing turístico", categoria: "marketing", precio_estimado: 30000 },
      { id: "seguros-hoteleros", nombre: "Seguros hoteleros", categoria: "legal", precio_estimado: 8000 },
      { id: "jardineria-exterior", nombre: "Jardinería y exterior", categoria: "infraestructura", precio_estimado: 40000 },
      { id: "capital-trabajo", nombre: "Capital trabajo 12 meses", categoria: "operativo", precio_estimado: 142000 }
    ],
    
    gastos_mensuales_detallados: {
      personal: { base: 12000, variable_ocupacion: 0.25 },
      suministros: { base: 2000, por_habitacion_ocupada: 15 },
      mantenimiento: 2500,
      marketing: { base: 1500, temporada_alta: 3000 },
      seguros: 1000,
      comisiones_booking: { porcentaje_ingresos: 0.12 },
      otros_operativos: 1500
    },
    
    revenue_streams: {
      habitaciones: {
        precio_habitacion_base: 120,
        rango_temporadas: { baja: 80, media: 120, alta: 180 },
        numero_habitaciones: 18,
        descripcion: "Ingresos por habitaciones"
      },
      restaurante: {
        desayunos: { precio: 12, inclusion: 0.80 },
        almuerzo_cena: { ticket_medio: 35, porcentaje_huespedes: 0.60 },
        externos: { comensales_dia: 15, ticket_medio: 30 },
        descripcion: "Servicios de restauración"
      },
      servicios_adicionales: {
        spa: { precio_tratamiento: 60, tratamientos_mes: 25 },
        actividades: { precio_actividad: 25, participantes_mes: 40 },
        transfer: { precio: 35, servicios_mes: 20 },
        descripcion: "Servicios complementarios"
      },
      eventos: {
        bodas: { precio_evento: 8000, eventos_ano: 12 },
        reuniones: { precio_dia: 500, dias_mes: 8 },
        descripcion: "Eventos y celebraciones"
      }
    },
    
    customer_management: {
      ocupacion_objetivo: 0.65,
      estancia_media: 3.2,
      estacionalidad: {
        enero: 0.3,   // Temporada muy baja
        febrero: 0.4, // Baja
        marzo: 0.6,   // Inicio recuperación
        abril: 0.8,   // Semana Santa
        mayo: 1.0,    // Inicio temporada
        junio: 1.2,   // Temporada alta inicio
        julio: 1.4,   // Pico verano
        agosto: 1.4,  // Pico máximo
        septiembre: 1.1, // Bajada suave
        octubre: 0.9, // Otoño
        noviembre: 0.5, // Baja
        diciembre: 0.4  // Mínimo año
      },
      tasa_repeticion: 0.25,
      booking_anticipacion_dias: 45
    },
    
    operational_kpis: {
      ocupacion_promedio: { target: 0.65, benchmark_sector: 0.60, critical: 0.40 },
      revpar: { target: 78, benchmark_sector: 72, critical: 50 },
      adr: { target: 120, benchmark_sector: 115, critical: 80 },
      satisfaccion_cliente: { target: 4.7, benchmark_sector: 4.4, critical: 4.0 },
      coste_por_habitacion: { target: 45, benchmark_sector: 50, critical: 65 },
      margen_restaurante: { target: 0.65, benchmark_sector: 0.60, critical: 0.50 }
    },
    
    aspectos_temporales: {
      obras_acondicionamiento: 6,
      pre_reservas: { meses_antes: 3, ocupacion_inicial: 0.15 },
      ramp_up: { meses: 12, factor_inicial: 0.2 },
      temporadas: {
        alta: [6, 7, 8], // junio, julio, agosto
        media: [4, 5, 9, 10], // abril, mayo, septiembre, octubre  
        baja: [1, 2, 3, 11, 12] // resto
      }
    }
  },

  // CONSULTORÍA PROFESIONAL - MODELO ACTUALIZADO
  "consultoria-profesional": {
    id: "consultoria-profesional", 
    nombre: "Consultoría Servicios Profesionales",
    sector: "Servicios B2B",
    categoria_inversion: "baja",
    inversion_min: 15000,
    inversion_max: 45000,
    inversion_promedio: 30000,
    description: "Consultoría B2B con gestión operacional de proyectos y clientes",
    
    items_obligatorios: [
      { id: "oficina-profesional", nombre: "Oficina profesional (6 meses)", categoria: "infraestructura", precio_estimado: 7200 },
      { id: "equipos-informaticos", nombre: "Equipos informáticos profesionales", categoria: "tecnologia", precio_estimado: 6000 },
      { id: "software-especializado", nombre: "Software especializado", categoria: "tecnologia", precio_estimado: 3500 },
      { id: "certificaciones", nombre: "Certificaciones profesionales", categoria: "legal", precio_estimado: 2500 },
      { id: "web-corporativa", nombre: "Web corporativa premium", categoria: "marketing", precio_estimado: 4000 },
      { id: "marketing-b2b", nombre: "Marketing digital B2B", categoria: "marketing", precio_estimado: 3500 },
      { id: "seguros-profesionales", nombre: "Seguros responsabilidad civil", categoria: "legal", precio_estimado: 800 },
      { id: "material-oficina", nombre: "Material oficina + mobiliario", categoria: "infraestructura", precio_estimado: 2000 },
      { id: "formacion-continua", nombre: "Formación continua", categoria: "personal", precio_estimado: 1500 }
    ],
    
    gastos_mensuales_detallados: {
      alquiler_oficina: 1200,
      personal: { consultores_junior: 2500, consultores_senior: 4500 },
      software_licencias: 400,
      marketing: { base: 600, lead_generation: 200 },
      formacion: 300,
      seguros: 80,
      gestoria: 150,
      otros_operativos: 200
    },
    
    revenue_streams: {
      consultoria_horas: {
        precio_hora_junior: 65,
        precio_hora_senior: 95,
        horas_facturables_mes: 120,
        descripcion: "Consultoría por horas"
      },
      proyectos_fijos: {
        precio_proyecto_promedio: 12000,
        proyectos_mes: 1.5,
        descripcion: "Proyectos precio fijo"
      },
      retainers: {
        precio_mensual: 3500,
        clientes_retainer: 3,
        descripcion: "Clientes con retainer mensual"
      },
      formacion: {
        precio_curso: 1500,
        cursos_mes: 2,
        descripcion: "Cursos de formación"
      }
    },
    
    customer_management: {
      clientes_nuevos_mes: 2,
      duracion_proyecto_promedio: 4, // meses
      estacionalidad: {
        enero: 1.1,   // Inicio año presupuestos
        febrero: 1.2, // Planificación anual
        marzo: 1.3,   // Ejecución proyectos
        abril: 1.0,   // Normalización
        mayo: 0.9,    // Pre-vacaciones
        junio: 0.8,   // Inicio vacaciones
        julio: 0.6,   // Vacaciones mínimo
        agosto: 0.5,  // Mínimo anual
        septiembre: 1.4, // Máximo del año
        octubre: 1.2, // Alta actividad
        noviembre: 1.1, // Cierre año
        diciembre: 0.8  // Fin año
      },
      tasa_retencion_clientes: 0.80,
      referidos_por_cliente: 1.2
    },
    
    operational_kpis: {
      margen_bruto: { target: 0.70, benchmark_sector: 0.65, critical: 0.55 },
      horas_facturables: { target: 120, benchmark_sector: 110, critical: 90 },
      precio_hora_promedio: { target: 85, benchmark_sector: 80, critical: 65 },
      tasa_utilizacion: { target: 0.75, benchmark_sector: 0.70, critical: 0.60 },
      satisfaccion_cliente: { target: 4.8, benchmark_sector: 4.5, critical: 4.0 },
      tiempo_cobro: { target: 45, benchmark_sector: 60, critical: 90 }
    },
    
    aspectos_temporales: {
      periodo_desarrollo_marca: 2,
      captacion_primeros_clientes: 3,
      ramp_up: { meses: 6, factor_inicial: 0.4 },
      estacionalidad_b2b: true
    }
  },

  // MODELO GENÉRICO ACTUALIZADO
  "generico": {
    id: "generico",
    nombre: "Plan Personalizado/Genérico",
    sector: "Personalizado",
    categoria_inversion: "personalizada",
    inversion_min: 0,
    inversion_max: 999999999,
    inversion_promedio: 50000,
    description: "Crea tu plan desde cero con gestión operacional personalizable",
    
    items_obligatorios: [
      { id: "item-personalizado-1", nombre: "Elemento personalizado 1", categoria: "personalizado", precio_estimado: 0 },
      { id: "item-personalizado-2", nombre: "Elemento personalizado 2", categoria: "personalizado", precio_estimado: 0 },
      { id: "item-personalizado-3", nombre: "Elemento personalizado 3", categoria: "personalizado", precio_estimado: 0 }
    ],
    
    gastos_mensuales_detallados: {
      gastos_generales: 0,
      personal: 0,
      marketing: 0,
      otros: 0
    },
    
    revenue_streams: {
      ingresos_principales: {
        precio_base: 0,
        descripcion: "Configurar según tu modelo"
      }
    },
    
    customer_management: {
      crecimiento_mensual_promedio: 0,
      tasa_abandono_mensual: 0.05,
      estacionalidad: {
        enero: 1.0, febrero: 1.0, marzo: 1.0, abril: 1.0,
        mayo: 1.0, junio: 1.0, julio: 1.0, agosto: 1.0,
        septiembre: 1.0, octubre: 1.0, noviembre: 1.0, diciembre: 1.0
      },
      personalizable: true
    },
    
    operational_kpis: {
      margen_bruto: { target: 0.30, benchmark_sector: 0.30, critical: 0.15 },
      personalizable: true
    },
    
    aspectos_temporales: {
      personalizable: true
    }
  }
};

// FUNCIONES AUXILIARES PROFESIONALES
export const getModelsByCategory = (categoria) => {
  return Object.values(businessModelsProfessional).filter(model => 
    model.categoria_inversion === categoria
  );
};

export const getModelsBySector = (sector) => {
  return Object.values(businessModelsProfessional).filter(model => 
    model.sector.toLowerCase().includes(sector.toLowerCase())
  );
};

export const getAllSectors = () => {
  return [...new Set(Object.values(businessModelsProfessional).map(model => model.sector))];
};

export const getAllCategories = () => {
  return ['muy-baja', 'baja', 'media', 'alta', 'muy-alta', 'personalizada'];
};

export const getCategoryLabel = (categoria) => {
  const labels = {
    'muy-baja': 'Muy Baja (< 10k€)',
    'baja': 'Baja (10k - 50k€)', 
    'media': 'Media (50k - 150k€)',
    'alta': 'Alta (150k - 500k€)',
    'muy-alta': 'Muy Alta (> 500k€)',
    'personalizada': 'Personalizada'
  };
  return labels[categoria] || categoria;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// VALIDADORES PROFESIONALES
export const validateModel = (modelId) => {
  return businessModelsProfessional[modelId] || null;
};

export const getModelRecommendations = (presupuesto) => {
  return Object.values(businessModelsProfessional).filter(model => 
    model.inversion_promedio <= presupuesto
  ).sort((a, b) => a.inversion_promedio - b.inversion_promedio);
};

// CALCULADORAS OPERACIONALES
export const calculateMonthlyRevenue = (model, month, customers) => {
  if (!model.revenue_streams) return 0;
  
  let totalRevenue = 0;
  const streams = model.revenue_streams;
  
  // Calcular cada fuente de ingresos
  Object.keys(streams).forEach(streamKey => {
    const stream = streams[streamKey];
    
    switch (streamKey) {
      case 'cuota_mensual':
        totalRevenue += customers * stream.precio_base;
        break;
      case 'matricula':
        // Solo nuevos clientes
        const newCustomers = customers * 0.1; // Asumimos 10% nuevos
        totalRevenue += newCustomers * stream.precio;
        break;
      // Añadir más cálculos según stream
    }
  });
  
  return totalRevenue;
};

export const calculateOperationalKPIs = (model, monthlyData) => {
  const kpis = {};
  
  if (model.operational_kpis) {
    Object.keys(model.operational_kpis).forEach(kpiKey => {
      const kpi = model.operational_kpis[kpiKey];
      // Calcular KPI según datos mensuales
      kpis[kpiKey] = {
        value: 0, // Calcular según lógica
        target: kpi.target,
        benchmark: kpi.benchmark_sector,
        status: 'ok' // ok, warning, critical
      };
    });
  }
  
  return kpis;
};