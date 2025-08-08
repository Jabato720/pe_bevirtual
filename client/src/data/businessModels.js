// Base de datos de modelos de negocio sectoriales
// 26 modelos profesionales + 1 genérico = 27 opciones totales

export const businessModels = {
  // INVERSIÓN MUY BAJA (< 10.000€)
  "dropshipping": {
    id: "dropshipping",
    nombre: "Dropshipping/E-commerce sin stock",
    sector: "Digital/E-commerce",
    categoria_inversion: "muy-baja",
    inversion_min: 500,
    inversion_max: 8000,
    inversion_promedio: 4250,
    description: "Tienda online sin inventario, productos enviados directamente desde proveedores",
    items_obligatorios: [
      { id: "plataforma-ecommerce", nombre: "Plataforma e-commerce (Shopify/WooCommerce)", categoria: "tecnologia", precio_estimado: 800 },
      { id: "dominio-hosting", nombre: "Dominio y hosting premium", categoria: "tecnologia", precio_estimado: 300 },
      { id: "marketing-digital", nombre: "Marketing digital inicial", categoria: "marketing", precio_estimado: 2000 },
      { id: "herramientas-dropshipping", nombre: "Herramientas dropshipping (Oberlo)", categoria: "tecnologia", precio_estimado: 400 },
      { id: "diseno-web", nombre: "Diseño web profesional", categoria: "marketing", precio_estimado: 1200 },
      { id: "pasarelas-pago", nombre: "Pasarelas de pago", categoria: "tecnologia", precio_estimado: 150 },
      { id: "atencion-cliente", nombre: "Sistema atención al cliente", categoria: "personal", precio_estimado: 600 },
      { id: "legal-basico", nombre: "Asesoría legal básica", categoria: "legal", precio_estimado: 400 }
    ],
    gastos_mensuales_estimados: {
      plataforma: 80,
      marketing_digital: 1500,
      herramientas: 120,
      atencion_cliente: 400,
      otros: 100
    },
    metricas_sector: {
      margen_bruto_promedio: 0.25,
      punto_equilibrio_meses: 4,
      tasa_conversion_promedio: 0.015,
      ticket_medio: 35,
      cac_promedio: 25
    }
  },

  // INVERSIÓN BAJA (10k - 50k€)
  "ecommerce-online": {
    id: "ecommerce-online",
    nombre: "E-commerce/Tienda Online con Stock",
    sector: "Digital/Retail",
    categoria_inversion: "baja",
    inversion_min: 15000,
    inversion_max: 50000,
    inversion_promedio: 32500,
    description: "Tienda online completa con inventario propio y logística integrada",
    items_obligatorios: [
      { id: "plataforma-ecommerce", nombre: "Plataforma e-commerce avanzada", categoria: "tecnologia", precio_estimado: 3000 },
      { id: "hosting-cdn", nombre: "Hosting premium + CDN", categoria: "tecnologia", precio_estimado: 600 },
      { id: "inventario-inicial", nombre: "Inventario inicial", categoria: "stock", precio_estimado: 15000 },
      { id: "diseno-web-premium", nombre: "Diseño web premium + UX", categoria: "marketing", precio_estimado: 4000 },
      { id: "sistema-gestion", nombre: "ERP/Sistema gestión", categoria: "tecnologia", precio_estimado: 2500 },
      { id: "marketing-digital", nombre: "Marketing digital + SEO", categoria: "marketing", precio_estimado: 5000 },
      { id: "logistica-envios", nombre: "Sistema logística y envíos", categoria: "operativo", precio_estimado: 2000 },
      { id: "fotografia-productos", nombre: "Fotografía profesional productos", categoria: "marketing", precio_estimado: 2000 },
      { id: "almacen-inicial", nombre: "Acondicionamiento almacén", categoria: "infraestructura", precio_estimado: 3000 },
      { id: "seguros-comerciales", nombre: "Seguros comerciales", categoria: "legal", precio_estimado: 400 }
    ],
    gastos_mensuales_estimados: {
      hosting: 100,
      marketing_digital: 1200,
      logistica: 800,
      personal: 2500,
      almacen: 600,
      otros: 300
    },
    metricas_sector: {
      margen_bruto_promedio: 0.40,
      punto_equilibrio_meses: 8,
      tasa_conversion_promedio: 0.025,
      ticket_medio: 65,
      cac_promedio: 35
    }
  },

  "consultoria-profesional": {
    id: "consultoria-profesional",
    nombre: "Consultoría Servicios Profesionales",
    sector: "Servicios B2B",
    categoria_inversion: "baja",
    inversion_min: 15000,
    inversion_max: 45000,
    inversion_promedio: 30000,
    description: "Consultoría especializada en servicios B2B de alto valor añadido",
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
    gastos_mensuales_estimados: {
      alquiler_oficina: 1200,
      personal: 4000,
      software_licencias: 400,
      marketing: 800,
      formacion: 300,
      otros: 300
    },
    metricas_sector: {
      margen_bruto_promedio: 0.70,
      punto_equilibrio_meses: 6,
      precio_hora_promedio: 95,
      horas_facturables_mes: 120,
      ticket_medio_proyecto: 8500
    }
  },

  "app-movil": {
    id: "app-movil",
    nombre: "Aplicación Móvil/SaaS",
    sector: "Tecnología/Software",
    categoria_inversion: "baja",
    inversion_min: 20000,
    inversion_max: 50000,
    inversion_promedio: 35000,
    description: "Desarrollo de aplicación móvil o plataforma SaaS",
    items_obligatorios: [
      { id: "desarrollo-app", nombre: "Desarrollo aplicación MVP", categoria: "tecnologia", precio_estimado: 18000 },
      { id: "infraestructura-cloud", nombre: "Infraestructura cloud (AWS/Azure)", categoria: "tecnologia", precio_estimado: 2000 },
      { id: "diseno-ux-ui", nombre: "Diseño UX/UI profesional", categoria: "marketing", precio_estimado: 4500 },
      { id: "testing-qa", nombre: "Testing y QA", categoria: "tecnologia", precio_estimado: 3000 },
      { id: "marketing-digital", nombre: "Marketing digital + ASO", categoria: "marketing", precio_estimado: 3500 },
      { id: "legal-ip", nombre: "Registro marca y propiedad intelectual", categoria: "legal", precio_estimado: 1500 },
      { id: "analytics", nombre: "Analytics y métricas", categoria: "tecnologia", precio_estimado: 800 },
      { id: "soporte-tecnico", nombre: "Soporte técnico inicial", categoria: "personal", precio_estimado: 1200 },
      { id: "app-stores", nombre: "Publicación en stores", categoria: "tecnologia", precio_estimado: 500 }
    ],
    gastos_mensuales_estimados: {
      hosting_cloud: 300,
      marketing_digital: 1500,
      personal_desarrollo: 3500,
      herramientas: 200,
      soporte: 500,
      otros: 200
    },
    metricas_sector: {
      margen_bruto_promedio: 0.85,
      punto_equilibrio_meses: 12,
      cac_promedio: 15,
      ltv_promedio: 180,
      churn_mensual: 0.05
    }
  },

  // INVERSIÓN MEDIA (50k - 150k€)
  "restaurante": {
    id: "restaurante",
    nombre: "Restaurante/Bar",
    sector: "Restauración",
    categoria_inversion: "media",
    inversion_min: 60000,
    inversion_max: 150000,
    inversion_promedio: 105000,
    description: "Restaurante de tamaño medio con cocina completa",
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
    gastos_mensuales_estimados: {
      alquiler: 3500,
      personal: 8000,
      materias_primas: 4500,
      suministros: 1200,
      marketing: 600,
      otros: 700
    },
    metricas_sector: {
      margen_bruto_promedio: 0.65,
      punto_equilibrio_meses: 8,
      ticket_medio: 28,
      rotacion_mesas_dia: 3,
      coste_materias_primas: 0.32
    }
  },

  "gimnasio-fitness": {
    id: "gimnasio-fitness",
    nombre: "Gimnasio/Centro Fitness",
    sector: "Deporte/Fitness",
    categoria_inversion: "media",
    inversion_min: 80000,
    inversion_max: 150000,
    inversion_promedio: 115000,
    description: "Centro fitness completo con equipamiento profesional",
    items_obligatorios: [
      { id: "acondicionamiento-local", nombre: "Acondicionamiento local", categoria: "infraestructura", precio_estimado: 25000 },
      { id: "equipamiento-cardio", nombre: "Equipamiento cardio", categoria: "equipamiento", precio_estimado: 30000 },
      { id: "equipamiento-musculacion", nombre: "Equipamiento musculación", categoria: "equipamiento", precio_estimado: 35000 },
      { id: "vestuarios-duchas", nombre: "Vestuarios y duchas", categoria: "infraestructura", precio_estimado: 12000 },
      { id: "sistema-gestion", nombre: "Software gestión socios", categoria: "tecnologia", precio_estimado: 2000 },
      { id: "sonido-climatizacion", nombre: "Sistema sonido + climatización", categoria: "infraestructura", precio_estimado: 6000 },
      { id: "seguros-responsabilidad", nombre: "Seguros responsabilidad civil", categoria: "legal", precio_estimado: 1500 },
      { id: "licencias-apertura", nombre: "Licencias de apertura", categoria: "legal", precio_estimado: 2000 },
      { id: "marketing-apertura", nombre: "Campaña marketing apertura", categoria: "marketing", precio_estimado: 3000 }
    ],
    gastos_mensuales_estimados: {
      alquiler: 4000,
      personal: 6000,
      suministros: 1500,
      mantenimiento: 800,
      marketing: 1200,
      seguros: 200,
      otros: 500
    },
    metricas_sector: {
      margen_bruto_promedio: 0.60,
      punto_equilibrio_meses: 10,
      cuota_media_mensual: 45,
      tasa_retencion: 0.85,
      capacidad_maxima: 800
    }
  },

  "comercio-retail": {
    id: "comercio-retail",
    nombre: "Comercio Retail/Tienda Física",
    sector: "Retail/Comercio",
    categoria_inversion: "media",
    inversion_min: 40000,
    inversion_max: 100000,
    inversion_promedio: 70000,
    description: "Tienda física especializada en sector específico",
    items_obligatorios: [
      { id: "acondicionamiento-local", nombre: "Acondicionamiento local comercial", categoria: "infraestructura", precio_estimado: 20000 },
      { id: "mobiliario-comercial", nombre: "Mobiliario comercial", categoria: "infraestructura", precio_estimado: 12000 },
      { id: "stock-inicial", nombre: "Stock inicial productos", categoria: "stock", precio_estimado: 25000 },
      { id: "sistema-pos", nombre: "Sistema TPV + software", categoria: "tecnologia", precio_estimado: 2000 },
      { id: "seguridad", nombre: "Sistema seguridad", categoria: "infraestructura", precio_estimado: 2500 },
      { id: "rotulacion-branding", nombre: "Rotulación y branding", categoria: "marketing", precio_estimado: 3000 },
      { id: "licencias-comerciales", nombre: "Licencias comerciales", categoria: "legal", precio_estimado: 1500 },
      { id: "seguros-comercio", nombre: "Seguros comercio", categoria: "legal", precio_estimado: 800 },
      { id: "marketing-apertura", nombre: "Marketing apertura", categoria: "marketing", precio_estimado: 2000 },
      { id: "capital-trabajo", nombre: "Capital trabajo 3 meses", categoria: "operativo", precio_estimado: 6200 }
    ],
    gastos_mensuales_estimados: {
      alquiler: 2500,
      personal: 2400,
      suministros: 300,
      marketing: 400,
      seguros: 80,
      otros: 320
    },
    metricas_sector: {
      margen_bruto_promedio: 0.50,
      punto_equilibrio_meses: 7,
      ticket_medio: 35,
      visitantes_dia: 50,
      tasa_conversion: 0.15
    }
  },

  // INVERSIÓN ALTA (150k - 500k€)
  "franquicia": {
    id: "franquicia",
    nombre: "Franquicia Establecida",
    sector: "Franquicias",
    categoria_inversion: "alta",
    inversion_min: 150000,
    inversion_max: 400000,
    inversion_promedio: 275000,
    description: "Franquicia de marca reconocida con modelo probado",
    items_obligatorios: [
      { id: "canon-entrada", nombre: "Canon entrada franquicia", categoria: "legal", precio_estimado: 45000 },
      { id: "acondicionamiento-local", nombre: "Acondicionamiento según estándares", categoria: "infraestructura", precio_estimado: 80000 },
      { id: "equipamiento-completo", nombre: "Equipamiento según franquiciador", categoria: "equipamiento", precio_estimado: 60000 },
      { id: "stock-inicial", nombre: "Stock inicial", categoria: "stock", precio_estimado: 35000 },
      { id: "formacion-inicial", nombre: "Formación inicial obligatoria", categoria: "personal", precio_estimado: 8000 },
      { id: "marketing-apertura", nombre: "Campaña marketing apertura", categoria: "marketing", precio_estimado: 15000 },
      { id: "sistema-gestion", nombre: "Sistema gestión franquicia", categoria: "tecnologia", precio_estimado: 5000 },
      { id: "seguros-franquicia", nombre: "Seguros específicos", categoria: "legal", precio_estimado: 2000 },
      { id: "capital-trabajo", nombre: "Capital trabajo 6 meses", categoria: "operativo", precio_estimado: 25000 }
    ],
    gastos_mensuales_estimados: {
      alquiler: 4000,
      personal: 8000,
      royalties: 2500,
      marketing_cooperativo: 1000,
      suministros: 800,
      otros: 700
    },
    metricas_sector: {
      margen_bruto_promedio: 0.55,
      punto_equilibrio_meses: 12,
      roi_promedio_anual: 0.20,
      tasa_exito: 0.85,
      royalty_promedio: 0.06
    }
  },

  "clinica-sanitaria": {
    id: "clinica-sanitaria",
    nombre: "Clínica/Centro Sanitario",
    sector: "Sanidad",
    categoria_inversion: "alta",
    inversion_min: 200000,
    inversion_max: 500000,
    inversion_promedio: 350000,
    description: "Centro sanitario especializado con equipamiento médico",
    items_obligatorios: [
      { id: "acondicionamiento-sanitario", nombre: "Acondicionamiento sanitario", categoria: "infraestructura", precio_estimado: 80000 },
      { id: "equipamiento-medico", nombre: "Equipamiento médico especializado", categoria: "equipamiento", precio_estimado: 150000 },
      { id: "mobiliario-clinico", nombre: "Mobiliario clínico", categoria: "infraestructura", precio_estimado: 25000 },
      { id: "software-gestion", nombre: "Software gestión clínica", categoria: "tecnologia", precio_estimado: 8000 },
      { id: "licencias-sanitarias", nombre: "Licencias sanitarias", categoria: "legal", precio_estimado: 15000 },
      { id: "seguros-sanitarios", nombre: "Seguros responsabilidad sanitaria", categoria: "legal", precio_estimado: 5000 },
      { id: "certificaciones", nombre: "Certificaciones calidad", categoria: "legal", precio_estimado: 8000 },
      { id: "formacion-personal", nombre: "Formación personal sanitario", categoria: "personal", precio_estimado: 12000 },
      { id: "marketing-sanitario", nombre: "Marketing sanitario", categoria: "marketing", precio_estimado: 10000 },
      { id: "capital-trabajo", nombre: "Capital trabajo inicial", categoria: "operativo", precio_estimado: 37000 }
    ],
    gastos_mensuales_estimados: {
      alquiler: 5000,
      personal_sanitario: 15000,
      suministros_medicos: 2000,
      seguros: 800,
      mantenimiento: 1200,
      marketing: 1500,
      otros: 1500
    },
    metricas_sector: {
      margen_bruto_promedio: 0.65,
      punto_equilibrio_meses: 15,
      precio_consulta_promedio: 80,
      consultas_dia_promedio: 20,
      tasa_ocupacion: 0.75
    }
  },

  // INVERSIÓN MUY ALTA (> 500k€)
  "hotel-rural": {
    id: "hotel-rural",
    nombre: "Hotel Rural/Turismo Rural",
    sector: "Turismo/Hostelería",
    categoria_inversion: "muy-alta",
    inversion_min: 500000,
    inversion_max: 1200000,
    inversion_promedio: 850000,
    description: "Hotel rural con restaurante y servicios turísticos",
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
    gastos_mensuales_estimados: {
      personal: 18000,
      suministros: 3000,
      mantenimiento: 2500,
      marketing: 2000,
      seguros: 1000,
      otros: 1500
    },
    metricas_sector: {
      margen_bruto_promedio: 0.70,
      punto_equilibrio_meses: 18,
      precio_habitacion_promedio: 120,
      ocupacion_promedio: 0.65,
      temporada_alta_meses: 6
    }
  },

  // MODELO GENÉRICO (#27)
  "generico": {
    id: "generico",
    nombre: "Plan Personalizado/Genérico",
    sector: "Personalizado",
    categoria_inversion: "personalizada",
    inversion_min: 0,
    inversion_max: 999999999,
    inversion_promedio: 50000,
    description: "Crea tu plan desde cero con total flexibilidad",
    items_obligatorios: [
      { id: "item-personalizado-1", nombre: "Elemento personalizado 1", categoria: "personalizado", precio_estimado: 0 },
      { id: "item-personalizado-2", nombre: "Elemento personalizado 2", categoria: "personalizado", precio_estimado: 0 },
      { id: "item-personalizado-3", nombre: "Elemento personalizado 3", categoria: "personalizado", precio_estimado: 0 }
    ],
    gastos_mensuales_estimados: {
      gastos_generales: 0,
      personal: 0,
      marketing: 0,
      otros: 0
    },
    metricas_sector: {
      margen_bruto_promedio: 0.30,
      punto_equilibrio_meses: 12,
      personalizable: true
    }
  }
};

// Funciones auxiliares
export const getModelsByCategory = (categoria) => {
  return Object.values(businessModels).filter(model => 
    model.categoria_inversion === categoria
  );
};

export const getModelsBySector = (sector) => {
  return Object.values(businessModels).filter(model => 
    model.sector.toLowerCase().includes(sector.toLowerCase())
  );
};

export const getAllSectors = () => {
  return [...new Set(Object.values(businessModels).map(model => model.sector))];
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

// Validadores
export const validateModel = (modelId) => {
  return businessModels[modelId] || null;
};

export const getModelRecommendations = (presupuesto) => {
  return Object.values(businessModels).filter(model => 
    model.inversion_promedio <= presupuesto
  ).sort((a, b) => a.inversion_promedio - b.inversion_promedio);
};