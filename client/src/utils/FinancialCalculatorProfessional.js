// CALCULADORA FINANCIERA PROFESIONAL
// Integra gestión operacional + múltiples ingresos + KPIs por sector
// Nivel Excel bancario profesional

export class FinancialCalculatorProfessional {
  constructor(businessModel) {
    this.businessModel = businessModel;
    this.sector = businessModel?.id || 'generico';
  }

  // CÁLCULO PRINCIPAL INTEGRADO
  calculateProfessionalPlan(inputs) {
    const {
      customerData,
      revenueConfig,
      costsConfig,
      fixedCosts = [],
      financialParams = {}
    } = inputs;

    // Validar inputs
    if (!customerData?.proyeccionClientes || !revenueConfig?.proyeccionIngresos || !costsConfig?.fixedCosts) {
      throw new Error('Faltan datos operacionales completos para el cálculo profesional (clientes, ingresos y costes)');
    }

    const results = {
      // Datos operacionales base
      customerMetrics: this.calculateCustomerMetrics(customerData),
      revenueMetrics: this.calculateRevenueMetrics(revenueConfig),
      costsMetrics: this.calculateCostsMetrics(costsConfig),
      
      // Proyecciones financieras avanzadas
      monthlyProjections: this.calculateDetailedMonthlyProjections(customerData, revenueConfig, costsConfig, fixedCosts),
      
      // Métricas financieras tradicionales
      financialMetrics: null,
      
      // KPIs operacionales calculados
      operationalKPIs: null,
      
      // Análisis de sensibilidad
      sensitivityAnalysis: null,
      
      // Ratios bancarios
      bankingRatios: null,
      
      // Rating y recomendación
      businessRating: null
    };

    // Calcular métricas financieras basadas en proyecciones operacionales
    results.financialMetrics = this.calculateFinancialMetrics(results.monthlyProjections, financialParams);
    
    // Calcular KPIs operacionales específicos del sector
    results.operationalKPIs = this.calculateSectorKPIs(results.monthlyProjections, customerData, revenueConfig, costsConfig);
    
    // Análisis de sensibilidad operacional
    results.sensitivityAnalysis = this.calculateOperationalSensitivity(inputs);
    
    // Ratios bancarios profesionales
    results.bankingRatios = this.calculateBankingRatios(results.monthlyProjections, financialParams);
    
    // Rating general del negocio
    results.businessRating = this.calculateBusinessRating(results);

    return results;
  }

  // MÉTRICAS DE CLIENTES
  calculateCustomerMetrics(customerData) {
    const proyeccionAno1 = customerData.proyeccionClientes.slice(0, 12);
    const proyeccionTotal = customerData.proyeccionClientes;

    return {
      // Año 1
      clientesFinAno1: proyeccionAno1[proyeccionAno1.length - 1]?.clientesActuales || 0,
      totalClientesNuevosAno1: proyeccionAno1.reduce((sum, p) => sum + p.clientesNuevos, 0),
      totalClientesPerdidosAno1: proyeccionAno1.reduce((sum, p) => sum + p.clientesPerdidos, 0),
      tasaRetencionPromedioAno1: proyeccionAno1.reduce((sum, p) => sum + (p.tasaRetencion || 0), 0) / proyeccionAno1.length,
      
      // 3 años
      clientesFinAno3: proyeccionTotal.length >= 36 ? proyeccionTotal[35]?.clientesActuales || 0 : 0,
      crecimientoPromedio3Anos: this.calculateCAGR(proyeccionTotal.slice(0, Math.min(36, proyeccionTotal.length))),
      
      // Patrones estacionales
      mesMaxClientes: this.findMaxMonth(proyeccionAno1, 'clientesNuevos'),
      mesMinClientes: this.findMinMonth(proyeccionAno1, 'clientesNuevos'),
      
      // Métricas operacionales
      churnRatePromedio: customerData.tasa_abandono_mensual,
      factorEstacionalidadMax: Math.max(...Object.values(customerData.proyeccionClientes?.[0]?.factorEstacional || {})),
      factorEstacionalidadMin: Math.min(...Object.values(customerData.proyeccionClientes?.[0]?.factorEstacional || {}))
    };
  }

  // MÉTRICAS DE INGRESOS
  calculateRevenueMetrics(revenueConfig) {
    const proyeccionAno1 = revenueConfig.proyeccionIngresos.slice(0, 12);

    // Análisis por fuentes de ingresos
    const streamAnalysis = {};
    Object.keys(revenueConfig.revenueConfig.streams).forEach(streamKey => {
      const totalStream = proyeccionAno1.reduce((sum, p) => sum + (p.ingresosPorStream[streamKey] || 0), 0);
      const promedioMensual = totalStream / 12;
      
      streamAnalysis[streamKey] = {
        totalAno1: totalStream,
        promedioMensual,
        porcentajeTotal: 0, // Se calculará después
        crecimientoMensual: this.calculateMonthlyGrowth(proyeccionAno1, streamKey),
        estacionalidad: this.calculateSeasonality(proyeccionAno1, streamKey)
      };
    });

    const totalIngresos = Object.values(streamAnalysis).reduce((sum, stream) => sum + stream.totalAno1, 0);

    // Calcular porcentajes
    Object.keys(streamAnalysis).forEach(streamKey => {
      streamAnalysis[streamKey].porcentajeTotal = totalIngresos > 0 ? (streamAnalysis[streamKey].totalAno1 / totalIngresos) * 100 : 0;
    });

    return {
      // Totales
      totalIngresosAno1: totalIngresos,
      ingresosMensualPromedio: totalIngresos / 12,
      
      // Por fuentes
      streamAnalysis,
      fuentePrincipal: this.findMainRevenueStream(streamAnalysis),
      diversificacionIngresos: this.calculateRevenueDiversification(streamAnalysis),
      
      // Crecimiento
      crecimientoMensualPromedio: this.calculateMonthlyGrowthRate(proyeccionAno1),
      mesMaxIngresos: this.findMaxMonth(proyeccionAno1, 'totalIngresos'),
      mesMinIngresos: this.findMinMonth(proyeccionAno1, 'totalIngresos'),
      
      // ARPU y métricas por cliente
      arpuAno1: 0, // Se calculará con datos de clientes
      ltv_estimado: 0 // Se calculará con datos de clientes
    };
  }

  // PROYECCIONES MENSUALES DETALLADAS 36 MESES
  calculateDetailedMonthlyProjections(customerData, revenueConfig, fixedCosts) {
    const proyecciones = [];
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + (cost.value || 0), 0);

    // Usar proyecciones operacionales como base
    const clientProjections = customerData.proyeccionClientes;
    const revenueProjections = revenueConfig.proyeccionIngresos;

    for (let mes = 1; mes <= 36; mes++) {
      const clientePeriodo = clientProjections[mes - 1];
      const ingresoPeriodo = revenueProjections[mes - 1];
      
      if (!clientePeriodo || !ingresoPeriodo) continue;

      // Costes variables basados en clientes
      const costesVariables = this.calculateVariableCosts(clientePeriodo, this.businessModel);
      
      // Costes específicos del sector
      const costesSectoriales = this.calculateSectorSpecificCosts(clientePeriodo, this.businessModel, mes);
      
      const totalCostes = totalFixedCosts + costesVariables + costesSectoriales;
      const ebitda = ingresoPeriodo.totalIngresos - totalCostes;
      const ebitdaMargin = ingresoPeriodo.totalIngresos > 0 ? (ebitda / ingresoPeriodo.totalIngresos) * 100 : 0;

      // Depreciación y amortización
      const depreciacion = this.calculateDepreciation(this.businessModel, mes);
      const ebit = ebitda - depreciacion;

      // Impuestos y financiación
      const interesesFinancieros = this.calculateInterest(this.businessModel, mes);
      const beneficioAntesImpuestos = ebit - interesesFinancieros;
      const impuestos = beneficioAntesImpuestos > 0 ? beneficioAntesImpuestos * 0.25 : 0; // 25% tipo impositivo
      const beneficioNeto = beneficioAntesImpuestos - impuestos;

      // Cash flow
      const cashFlowOperativo = beneficioNeto + depreciacion;
      const inversionesCapital = this.calculateCapitalInvestments(mes);
      const cashFlowLibre = cashFlowOperativo - inversionesCapital;

      proyecciones.push({
        mes,
        año: Math.ceil(mes / 12),
        mesNombre: clientePeriodo.mesNombre,
        
        // Operacionales
        clientesNuevos: clientePeriodo.clientesNuevos,
        clientesPerdidos: clientePeriodo.clientesPerdidos,
        clientesActuales: clientePeriodo.clientesActuales,
        tasaRetencion: clientePeriodo.tasaRetencion,
        factorEstacional: clientePeriodo.factorEstacional,
        
        // Ingresos detallados
        ingresosPorStream: ingresoPeriodo.ingresosPorStream,
        totalIngresos: ingresoPeriodo.totalIngresos,
        ingresosPorCliente: clientePeriodo.clientesActuales > 0 ? ingresoPeriodo.totalIngresos / clientePeriodo.clientesActuales : 0,
        
        // Costes detallados
        costesFijos: totalFixedCosts,
        costesVariables,
        costesSectoriales,
        totalCostes,
        costePorCliente: clientePeriodo.clientesActuales > 0 ? totalCostes / clientePeriodo.clientesActuales : 0,
        
        // Márgenes
        margenBruto: ingresoPeriodo.totalIngresos - costesVariables,
        margenBrutoPercent: ingresoPeriodo.totalIngresos > 0 ? ((ingresoPeriodo.totalIngresos - costesVariables) / ingresoPeriodo.totalIngresos) * 100 : 0,
        
        // Resultados
        ebitda,
        ebitdaMargin,
        ebit,
        beneficioAntesImpuestos,
        impuestos,
        beneficioNeto,
        
        // Cash flow
        cashFlowOperativo,
        inversionesCapital,
        cashFlowLibre,
        cashFlowAcumulado: mes === 1 ? cashFlowLibre : proyecciones[mes - 2]?.cashFlowAcumulado + cashFlowLibre,
        
        // Métricas específicas del sector
        metricas_sector: this.calculateSectorMetrics(clientePeriodo, ingresoPeriodo, this.businessModel)
      });
    }

    return proyecciones;
  }

  // CÁLCULO DE COSTES VARIABLES POR SECTOR
  calculateVariableCosts(clientePeriodo, businessModel) {
    const clientes = clientePeriodo.clientesActuales;
    let costesVariables = 0;

    if (businessModel?.gastos_mensuales_detallados?.personal?.variable_por_clientes) {
      costesVariables += clientes * businessModel.gastos_mensuales_detallados.personal.variable_por_clientes;
    }

    // Costes variables específicos por sector
    switch (businessModel?.id) {
      case 'gimnasio-fitness':
        // Costes por uso: toallas, productos limpieza, etc.
        costesVariables += clientes * 2.5; // €2.5 por cliente/mes
        break;
        
      case 'restaurante':
        // Materias primas variables
        const ventasComida = clientePeriodo.ingresosPorStream?.ventas_comida || 0;
        if (businessModel.gastos_mensuales_detallados?.materias_primas?.porcentaje_ventas) {
          costesVariables += ventasComida * businessModel.gastos_mensuales_detallados.materias_primas.porcentaje_ventas;
        }
        break;
        
      case 'ecommerce-profesional':
        // Comisiones marketplaces, pagos, logística
        const totalIngresos = clientePeriodo.totalIngresos || 0;
        costesVariables += totalIngresos * 0.15; // 15% comisiones variables
        break;
        
      case 'hotel-rural':
        // Costes por habitación ocupada
        const habitacionesOcupadas = clientes * (businessModel.customer_management?.estancia_media || 3.2);
        costesVariables += habitacionesOcupadas * 15; // €15 por habitación ocupada
        break;
    }

    return Math.round(costesVariables);
  }

  // COSTES SECTORIALES ESPECÍFICOS
  calculateSectorSpecificCosts(clientePeriodo, businessModel, mes) {
    let costesSectoriales = 0;
    const gastos = businessModel?.gastos_mensuales_detallados || {};

    // Sumar todos los gastos base del modelo
    Object.keys(gastos).forEach(conceptoGasto => {
      const gasto = gastos[conceptoGasto];
      
      if (typeof gasto === 'number') {
        costesSectoriales += gasto;
      } else if (typeof gasto === 'object' && gasto.base) {
        costesSectoriales += gasto.base;
        
        // Gastos variables adicionales
        if (gasto.porcentaje_ventas && clientePeriodo.totalIngresos) {
          costesSectoriales += clientePeriodo.totalIngresos * gasto.porcentaje_ventas;
        }
        
        if (gasto.por_pedido && clientePeriodo.pedidos) {
          costesSectoriales += clientePeriodo.pedidos * gasto.por_pedido;
        }
      }
    });

    // Ajustes estacionales para algunos gastos
    if (businessModel?.id === 'hotel-rural' && gastos.marketing?.temporada_alta) {
      const mesCalendario = ((mes - 1) % 12) + 1;
      const temporadaAlta = [6, 7, 8]; // junio, julio, agosto
      if (temporadaAlta.includes(mesCalendario)) {
        costesSectoriales += gastos.marketing.temporada_alta - (gastos.marketing.base || 0);
      }
    }

    return Math.round(costesSectoriales);
  }

  // MÉTRICAS FINANCIERAS TRADICIONALES
  calculateFinancialMetrics(monthlyProjections, financialParams) {
    if (!monthlyProjections || monthlyProjections.length === 0) {
      return null;
    }

    const proyeccionAno1 = monthlyProjections.slice(0, 12);
    const inversion = financialParams.inversionInicial || this.businessModel?.inversion_promedio || 100000;

    // Cash flows para TIR y VAN
    const cashFlows = [-inversion, ...proyeccionAno1.map(p => p.cashFlowLibre)];
    
    return {
      // Métricas de rentabilidad
      van: this.calculateNPV(cashFlows, 0.12), // 12% tasa descuento
      tir: this.calculateIRR(cashFlows) * 100,
      
      // Recuperación de inversión
      paybackMeses: this.calculatePayback(monthlyProjections, inversion),
      paybackDescontado: this.calculateDiscountedPayback(monthlyProjections, inversion, 0.12),
      
      // Márgenes
      margenBrutoAno1: this.calculateAverageMargin(proyeccionAno1, 'margenBrutoPercent'),
      margenEbitdaAno1: this.calculateAverageMargin(proyeccionAno1, 'ebitdaMargin'),
      margenNetoAno1: this.calculateNetMargin(proyeccionAno1),
      
      // Totales año 1
      ingresosAno1: proyeccionAno1.reduce((sum, p) => sum + p.totalIngresos, 0),
      ebitdaAno1: proyeccionAno1.reduce((sum, p) => sum + p.ebitda, 0),
      beneficioNetoAno1: proyeccionAno1.reduce((sum, p) => sum + p.beneficioNeto, 0),
      cashFlowLibreAno1: proyeccionAno1.reduce((sum, p) => sum + p.cashFlowLibre, 0),
      
      // Break even
      breakEvenMes: this.findBreakEvenMonth(monthlyProjections),
      breakEvenClientes: this.calculateBreakEvenCustomers(monthlyProjections),
      
      // Ratios
      roe: this.calculateROE(proyeccionAno1, inversion),
      roa: this.calculateROA(proyeccionAno1, inversion),
      roic: this.calculateROIC(proyeccionAno1, inversion)
    };
  }

  // KPIS OPERACIONALES POR SECTOR
  calculateSectorKPIs(monthlyProjections, customerData, revenueConfig) {
    const kpis = {};
    const proyeccionAno1 = monthlyProjections.slice(0, 12);
    const sector = this.businessModel?.id;

    // KPIs comunes a todos los sectores
    kpis.retencion_promedio = {
      value: proyeccionAno1.reduce((sum, p) => sum + (p.tasaRetencion || 0), 0) / proyeccionAno1.length,
      target: this.businessModel?.operational_kpis?.tasa_retencion?.target || 0.70,
      unit: 'percentage'
    };

    kpis.arpu = {
      value: proyeccionAno1.reduce((sum, p) => sum + (p.ingresosPorCliente || 0), 0) / proyeccionAno1.length,
      target: this.businessModel?.operational_kpis?.ingresos_por_cliente?.target || 50,
      unit: 'currency'
    };

    // KPIs específicos por sector
    switch (sector) {
      case 'gimnasio-fitness':
        const capacidadMaxima = this.businessModel.aspectos_temporales?.capacidad_maxima || 1200;
        const ocupacionPromedio = proyeccionAno1.reduce((sum, p) => sum + p.clientesActuales, 0) / (proyeccionAno1.length * capacidadMaxima);
        
        kpis.ocupacion = {
          value: ocupacionPromedio,
          target: this.businessModel.operational_kpis?.ocupacion_promedio?.target || 0.70,
          unit: 'percentage'
        };
        break;

      case 'restaurante':
        const ticketMedio = this.calculateTicketMedio(proyeccionAno1);
        kpis.ticket_medio = {
          value: ticketMedio,
          target: this.businessModel.operational_kpis?.ticket_medio?.target || 25,
          unit: 'currency'
        };
        break;

      case 'ecommerce-profesional':
        kpis.conversion_rate = {
          value: this.businessModel.revenue_streams?.ventas_productos?.conversion_rate_base || 0.025,
          target: this.businessModel.operational_kpis?.conversion_rate?.target || 0.030,
          unit: 'percentage'
        };
        break;

      case 'hotel-rural':
        const ocupacionHotel = this.businessModel.customer_management?.ocupacion_objetivo || 0.65;
        kpis.ocupacion_hotel = {
          value: ocupacionHotel,
          target: this.businessModel.operational_kpis?.ocupacion_promedio?.target || 0.65,
          unit: 'percentage'
        };
        break;
    }

    return kpis;
  }

  // RATIOS BANCARIOS PROFESIONALES
  calculateBankingRatios(monthlyProjections, financialParams) {
    const proyeccionAno1 = monthlyProjections.slice(0, 12);
    const inversion = financialParams.inversionInicial || 100000;
    const prestamo = financialParams.prestamoPrincipal || 0;
    const cuotaPrestamo = financialParams.cuotaMensualPrestamo || 0;

    const ebitdaAno1 = proyeccionAno1.reduce((sum, p) => sum + p.ebitda, 0);
    const servicioDeuda = cuotaPrestamo * 12;

    return {
      // Ratios de solvencia
      dscr: servicioDeuda > 0 ? ebitdaAno1 / servicioDeuda : null, // Debt Service Coverage Ratio
      ratioEndeudamiento: prestamo / inversion,
      autonomiaFinanciera: (inversion - prestamo) / inversion,
      
      // Ratios de liquidez
      cashRatio: this.calculateCashRatio(proyeccionAno1),
      ratioLiquidez: this.calculateLiquidityRatio(proyeccionAno1),
      
      // Ratios de rentabilidad
      roe: this.calculateROE(proyeccionAno1, inversion - prestamo),
      roa: this.calculateROA(proyeccionAno1, inversion),
      
      // Ratios operacionales
      margenEbitda: ebitdaAno1 / proyeccionAno1.reduce((sum, p) => sum + p.totalIngresos, 0),
      rotacionActivos: proyeccionAno1.reduce((sum, p) => sum + p.totalIngresos, 0) / inversion,
      
      // Rating calculado
      ratingBancario: this.calculateBankingRating(ebitdaAno1, servicioDeuda, inversion, prestamo)
    };
  }

  // RATING GENERAL DEL NEGOCIO
  calculateBusinessRating(results) {
    const scores = {
      financial: 0,
      operational: 0,
      market: 0,
      risk: 0
    };

    // Score financiero (0-25)
    if (results.financialMetrics?.tir >= 20) scores.financial += 10;
    else if (results.financialMetrics?.tir >= 15) scores.financial += 7;
    else if (results.financialMetrics?.tir >= 10) scores.financial += 5;

    if (results.financialMetrics?.van > 0) scores.financial += 10;
    if (results.bankingRatios?.dscr >= 1.5) scores.financial += 5;

    // Score operacional (0-25)
    const kpis = Object.values(results.operationalKPIs || {});
    const kpisExcellent = kpis.filter(kpi => kpi.value >= kpi.target).length;
    scores.operational = Math.round((kpisExcellent / Math.max(kpis.length, 1)) * 25);

    // Score de mercado (0-25)
    if (results.revenueMetrics?.diversificacionIngresos >= 0.7) scores.market += 10;
    if (results.customerMetrics?.crecimientoPromedio3Anos >= 0.15) scores.market += 10;
    scores.market += 5; // Puntuación base

    // Score de riesgo (0-25)
    if (results.customerMetrics?.tasaRetencionPromedioAno1 >= 0.8) scores.risk += 10;
    if (results.financialMetrics?.paybackMeses <= 24) scores.risk += 10;
    scores.risk += 5; // Puntuación base

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    let rating = 'D';
    let description = 'Riesgo muy alto';

    if (totalScore >= 90) { rating = 'A+'; description = 'Excelente'; }
    else if (totalScore >= 80) { rating = 'A'; description = 'Muy bueno'; }
    else if (totalScore >= 70) { rating = 'B+'; description = 'Bueno'; }
    else if (totalScore >= 60) { rating = 'B'; description = 'Aceptable'; }
    else if (totalScore >= 50) { rating = 'C'; description = 'Regular'; }

    return {
      rating,
      description,
      totalScore,
      scores,
      recommendation: this.getRecommendation(rating, results)
    };
  }

  // MÉTODOS AUXILIARES
  calculateNPV(cashFlows, discountRate) {
    return cashFlows.reduce((npv, cashFlow, index) => {
      return npv + cashFlow / Math.pow(1 + discountRate, index);
    }, 0);
  }

  calculateIRR(cashFlows) {
    // Implementación simplificada del TIR usando Newton-Raphson
    let rate = 0.1;
    const epsilon = 1e-7;
    const maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPV(cashFlows, rate);
      const derivative = cashFlows.reduce((sum, cashFlow, index) => {
        return sum - index * cashFlow / Math.pow(1 + rate, index + 1);
      }, 0);
      
      const newRate = rate - npv / derivative;
      if (Math.abs(newRate - rate) < epsilon) break;
      rate = newRate;
    }
    
    return rate;
  }

  calculatePayback(monthlyProjections, investment) {
    let cumulativeCashFlow = -investment;
    
    for (let i = 0; i < monthlyProjections.length; i++) {
      cumulativeCashFlow += monthlyProjections[i].cashFlowLibre;
      if (cumulativeCashFlow >= 0) {
        return i + 1;
      }
    }
    
    return null; // No se recupera la inversión en el período
  }

  findBreakEvenMonth(monthlyProjections) {
    for (let i = 0; i < monthlyProjections.length; i++) {
      if (monthlyProjections[i].ebitda > 0) {
        return i + 1;
      }
    }
    return null;
  }

  calculateCAGR(projections) {
    if (projections.length < 2) return 0;
    const initial = projections[0].clientesActuales || 1;
    const final = projections[projections.length - 1].clientesActuales || 1;
    const periods = projections.length / 12; // años
    return Math.pow(final / initial, 1 / periods) - 1;
  }

  getRecommendation(rating, results) {
    switch (rating) {
      case 'A+':
      case 'A':
        return 'Proyecto altamente recomendado. Excelentes métricas financieras y operacionales.';
      case 'B+':
      case 'B':
        return 'Proyecto viable con buen potencial. Revisar algunos KPIs operacionales.';
      case 'C':
        return 'Proyecto con riesgos moderados. Requiere optimización antes de la implementación.';
      default:
        return 'Proyecto de alto riesgo. Revisar fundamentalmente el modelo de negocio.';
    }
  }

  // Más métodos auxiliares específicos por sector...
  calculateTicketMedio(projections) {
    // Implementación específica para restaurantes
    const totalVentas = projections.reduce((sum, p) => sum + (p.ingresosPorStream?.ventas_comida || 0), 0);
    const comensalesEstimados = 45 * 30 * 12; // 45 comensales/día * 30 días * 12 meses
    return comensalesEstimados > 0 ? totalVentas / comensalesEstimados : 0;
  }

  calculateDepreciation(businessModel, month) {
    // Depreciación estimada basada en la inversión inicial
    const inversion = businessModel?.inversion_promedio || 100000;
    const vidaUtil = 120; // 10 años en meses
    return inversion / vidaUtil;
  }

  calculateInterest(businessModel, month) {
    // Intereses estimados - simplificado
    return 0; // Se calculará con datos reales del préstamo
  }

  calculateCapitalInvestments(month) {
    // Inversiones adicionales de capital por mes
    return 0; // Se calculará según necesidades específicas
  }

  calculateSectorMetrics(clientePeriodo, ingresoPeriodo, businessModel) {
    // Métricas específicas calculadas por sector
    const metrics = {};
    
    switch (businessModel?.id) {
      case 'gimnasio-fitness':
        metrics.clientes_por_m2 = clientePeriodo.clientesActuales / 500; // Asumiendo 500m2
        metrics.ingresos_pt = ingresoPeriodo.ingresosPorStream?.personal_training || 0;
        break;
        
      case 'restaurante':
        metrics.comensales_estimados = (businessModel.customer_management?.comensales_dia_promedio || 45) * 30;
        metrics.rotacion_real = metrics.comensales_estimados / 25; // 25 mesas asumidas
        break;
        
      case 'hotel-rural':
        metrics.habitaciones_ocupadas = clientePeriodo.clientesActuales * (businessModel.customer_management?.estancia_media || 3.2) / 30;
        metrics.revpar = (ingresoPeriodo.ingresosPorStream?.habitaciones || 0) / (businessModel.revenue_streams?.habitaciones?.numero_habitaciones || 18) / 30;
        break;
    }
    
    return metrics;
  }

  findMainRevenueStream(streamAnalysis) {
    let maxRevenue = 0;
    let mainStream = null;
    
    Object.entries(streamAnalysis).forEach(([key, stream]) => {
      if (stream.totalAno1 > maxRevenue) {
        maxRevenue = stream.totalAno1;
        mainStream = key;
      }
    });
    
    return mainStream;
  }

  calculateRevenueDiversification(streamAnalysis) {
    // Índice de diversificación (0 = concentrado, 1 = diversificado)
    const revenues = Object.values(streamAnalysis).map(s => s.porcentajeTotal / 100);
    const hhi = revenues.reduce((sum, percentage) => sum + Math.pow(percentage, 2), 0);
    return 1 - hhi; // Invertir para que 1 = máxima diversificación
  }

  findMaxMonth(projections, field) {
    let maxValue = 0;
    let maxMonth = null;
    
    projections.forEach((p, index) => {
      if (p[field] > maxValue) {
        maxValue = p[field];
        maxMonth = p.mesNombre;
      }
    });
    
    return { month: maxMonth, value: maxValue };
  }

  findMinMonth(projections, field) {
    let minValue = Infinity;
    let minMonth = null;
    
    projections.forEach((p, index) => {
      if (p[field] < minValue) {
        minValue = p[field];
        minMonth = p.mesNombre;
      }
    });
    
    return { month: minMonth, value: minValue };
  }

  calculateMonthlyGrowthRate(projections) {
    if (projections.length < 2) return 0;
    
    const growthRates = [];
    for (let i = 1; i < projections.length; i++) {
      const current = projections[i].totalIngresos;
      const previous = projections[i - 1].totalIngresos;
      if (previous > 0) {
        growthRates.push((current - previous) / previous);
      }
    }
    
    return growthRates.length > 0 ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length : 0;
  }

  calculateBankingRating(ebitda, serviceDebt, investment, loan) {
    let score = 0;
    
    // DSCR
    const dscr = serviceDebt > 0 ? ebitda / serviceDebt : 10;
    if (dscr >= 2.0) score += 30;
    else if (dscr >= 1.5) score += 25;
    else if (dscr >= 1.25) score += 20;
    else if (dscr >= 1.0) score += 10;
    
    // Ratio de endeudamiento
    const debtRatio = loan / investment;
    if (debtRatio <= 0.5) score += 25;
    else if (debtRatio <= 0.7) score += 20;
    else if (debtRatio <= 0.8) score += 15;
    else score += 5;
    
    // Rentabilidad
    const roiEstimated = ebitda / investment;
    if (roiEstimated >= 0.25) score += 25;
    else if (roiEstimated >= 0.20) score += 20;
    else if (roiEstimated >= 0.15) score += 15;
    else score += 10;
    
    // Experiencia y mercado (base)
    score += 20;
    
    if (score >= 90) return 'AAA';
    if (score >= 80) return 'AA';
    if (score >= 70) return 'A';
    if (score >= 60) return 'BBB';
    if (score >= 50) return 'BB';
    if (score >= 40) return 'B';
    return 'C';
  }

  calculateROE(projections, equity) {
    const netIncome = projections.reduce((sum, p) => sum + p.beneficioNeto, 0);
    return equity > 0 ? (netIncome / equity) * 100 : 0;
  }

  calculateROA(projections, totalAssets) {
    const netIncome = projections.reduce((sum, p) => sum + p.beneficioNeto, 0);
    return totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
  }

  calculateROIC(projections, investedCapital) {
    const nopat = projections.reduce((sum, p) => sum + p.ebit * 0.75, 0); // EBIT * (1 - tax rate)
    return investedCapital > 0 ? (nopat / investedCapital) * 100 : 0;
  }

  calculateAverageMargin(projections, field) {
    return projections.reduce((sum, p) => sum + (p[field] || 0), 0) / projections.length;
  }

  calculateNetMargin(projections) {
    const totalRevenue = projections.reduce((sum, p) => sum + p.totalIngresos, 0);
    const totalNetIncome = projections.reduce((sum, p) => sum + p.beneficioNeto, 0);
    return totalRevenue > 0 ? (totalNetIncome / totalRevenue) * 100 : 0;
  }

  calculateBreakEvenCustomers(projections) {
    const breakEvenProjection = projections.find(p => p.ebitda > 0);
    return breakEvenProjection ? breakEvenProjection.clientesActuales : 0;
  }

  calculateCashRatio(projections) {
    // Simplificado - basado en cash flow acumulado vs gastos mensuales
    const avgMonthlyCosts = projections.reduce((sum, p) => sum + p.totalCostes, 0) / projections.length;
    const finalCashFlow = projections[projections.length - 1]?.cashFlowAcumulado || 0;
    return avgMonthlyCosts > 0 ? finalCashFlow / avgMonthlyCosts : 0;
  }

  calculateLiquidityRatio(projections) {
    // Ratio de liquidez simplificado
    const avgMonthlyIncome = projections.reduce((sum, p) => sum + p.totalIngresos, 0) / projections.length;
    const avgMonthlyCosts = projections.reduce((sum, p) => sum + p.totalCostes, 0) / projections.length;
    return avgMonthlyCosts > 0 ? avgMonthlyIncome / avgMonthlyCosts : 0;
  }

  calculateMonthlyGrowth(projections, streamKey) {
    // Cálculo de crecimiento mensual por fuente de ingresos
    const values = projections.map(p => p.ingresosPorStream[streamKey] || 0);
    if (values.length < 2) return 0;
    
    let totalGrowth = 0;
    let validPeriods = 0;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        totalGrowth += (values[i] - values[i - 1]) / values[i - 1];
        validPeriods++;
      }
    }
    
    return validPeriods > 0 ? (totalGrowth / validPeriods) * 100 : 0;
  }

  calculateSeasonality(projections, streamKey) {
    // Análisis de estacionalidad por fuente de ingresos
    const values = projections.map(p => p.ingresosPorStream[streamKey] || 0);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    const maxVariation = Math.max(...values.map(val => Math.abs(val - average) / average));
    return maxVariation; // Factor de estacionalidad (0 = sin estacionalidad, 1+ = alta estacionalidad)
  }
}

// EXPORTAR FUNCIONES UTILES
export const createProfessionalCalculator = (businessModel) => {
  return new FinancialCalculatorProfessional(businessModel);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 0) => {
  return value.toLocaleString('es-ES', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  });
};

// ======== MÉTODOS ADICIONALES PARA INTEGRAR COSTES ========

// MÉTRICAS DE COSTES
FinancialCalculatorProfessional.prototype.calculateCostsMetrics = function(costsConfig) {
  const fixedCosts = costsConfig.fixedCosts || [];
  
  // Análisis de estructura de costes
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.baseAmount, 0);
  const totalVariableRate = fixedCosts.reduce((sum, cost) => sum + (cost.variableRate || 0), 0);
  
  // Categorización de costes
  const costsByCategory = {};
  fixedCosts.forEach(cost => {
    const category = cost.category || 'other';
    if (!costsByCategory[category]) {
      costsByCategory[category] = { fixed: 0, variable: 0, count: 0 };
    }
    costsByCategory[category].fixed += cost.baseAmount;
    costsByCategory[category].variable += cost.variableRate || 0;
    costsByCategory[category].count++;
  });

  // Costes con estacionalidad
  const seasonalCosts = fixedCosts.filter(cost => cost.hasSeasonality);
  const fixedSeasonalAmount = seasonalCosts.reduce((sum, cost) => sum + cost.baseAmount, 0);

  return {
    // Totales
    totalFixedCosts,
    totalVariableRate,
    totalCosts: totalFixedCosts, // Base sin clientes
    
    // Estructura
    costsByCategory,
    numberOfCostItems: fixedCosts.length,
    
    // Flexibilidad
    variableCostPercentage: totalVariableRate > 0 ? (totalVariableRate / (totalVariableRate + totalFixedCosts)) * 100 : 0,
    fixedCostPercentage: (totalFixedCosts / (totalFixedCosts + totalVariableRate)) * 100,
    
    // Estacionalidad
    seasonalCostsCount: seasonalCosts.length,
    seasonalCostsAmount: fixedSeasonalAmount,
    seasonalCostsPercentage: totalFixedCosts > 0 ? (fixedSeasonalAmount / totalFixedCosts) * 100 : 0,
    
    // Ratios por categoría
    operationalPercentage: costsByCategory.operational ? 
      (costsByCategory.operational.fixed / totalFixedCosts) * 100 : 0,
    personnelPercentage: costsByCategory.personnel ? 
      (costsByCategory.personnel.fixed / totalFixedCosts) * 100 : 0,
    marketingPercentage: costsByCategory.marketing ? 
      (costsByCategory.marketing.fixed / totalFixedCosts) * 100 : 0
  };
};

// PROYECCIONES MENSUALES DETALLADAS CON COSTES EXACTAS EXCEL
FinancialCalculatorProfessional.prototype.calculateDetailedMonthlyProjections = function(customerData, revenueConfig, costsConfig, legacyFixedCosts = []) {
  const proyeccionClientes = customerData.proyeccionClientes || [];
  const proyeccionIngresos = revenueConfig.proyeccionIngresos || [];
  const fixedCosts = costsConfig?.fixedCosts || [];
  
  const projections = [];
  const estacionalidad = this.businessModel?.customer_management?.estacionalidad || {};
  
  // DATOS ESPECIALES DEL EXCEL
  const aspectosTemporales = this.businessModel?.aspectos_temporales || {};
  const carenciaAlquiler = aspectosTemporales.carencia_alquiler || 0;
  const preVentas = aspectosTemporales.pre_ventas_apertura || 0;
  const rampUpMeses = aspectosTemporales.ramp_up_meses || 0;
  const factorRampUp = aspectosTemporales.factor_ramp_up || 1;
  
  // GASTOS ESPECIALES DEL MODELO
  const gastosDetallados = this.businessModel?.gastos_mensuales_detallados || {};
  const alquilerData = gastosDetallados.alquiler || { base: 0, carencia_meses: 0 };
  const personalData = gastosDetallados.personal || { base: 0, escalado: [0] };
  const publicidadInicial = gastosDetallados.publicidad_inicial || 0;

  for (let month = 1; month <= Math.max(36, proyeccionClientes.length); month++) {
    const monthIndex = month - 1;
    const monthName = new Date(2024, (month - 1) % 12).toLocaleString('es', { month: 'short' });
    const seasonalFactor = estacionalidad[Object.keys(estacionalidad)[(month - 1) % 12]] || 1.0;
    
    // DATOS CLIENTES CON PRE-VENTA Y RAMP-UP
    const clientesData = proyeccionClientes[monthIndex] || proyeccionClientes[proyeccionClientes.length - 1];
    let clientesDelMes = clientesData?.clientesActuales || 0;
    let clientesNuevos = clientesData?.clientesNuevos || 0;
    
    // APLICAR PRE-VENTA EN MES 1
    if (month === 1 && preVentas > 0) {
      clientesDelMes = preVentas; // Empezamos con pre-ventas
      clientesNuevos = preVentas;
    }
    
    // APLICAR RAMP-UP (capacidad gradual)
    if (month <= rampUpMeses && factorRampUp < 1) {
      const factorMes = factorRampUp + ((1 - factorRampUp) * ((month - 1) / (rampUpMeses - 1)));
      const objetivoMes = clientesData?.clientesActuales || 0;
      clientesDelMes = Math.round(objetivoMes * factorMes);
    }
    
    // Datos de ingresos del mes
    const ingresosData = proyeccionIngresos[monthIndex] || proyeccionIngresos[proyeccionIngresos.length - 1];
    const ingresosDelMes = ingresosData?.totalIngresos || 0;
    
    // CÁLCULO DETALLADO DE COSTES EXACTO EXCEL
    let totalCostsFijos = 0;
    let totalCostsVariables = 0;
    const costsBreakdown = {};
    
    // 1. COSTES FIJOS BASE (8,548€) - Siempre aplican
    Object.entries(gastosDetallados).forEach(([key, value]) => {
      if (typeof value === 'number' && !['publicidad_inicial', 'leasing_equipos'].includes(key)) {
        totalCostsFijos += value;
        costsBreakdown[key] = {
          name: key.replace('_', ' ').toUpperCase(),
          fixed: value,
          variable: 0,
          total: value,
          category: 'operational'
        };
      }
    });
    
    // 2. ALQUILER CON CARENCIA
    const alquilerMes = month <= carenciaAlquiler ? 0 : alquilerData.base;
    totalCostsFijos += alquilerMes;
    costsBreakdown.alquiler = {
      name: 'ALQUILER',
      fixed: alquilerMes,
      variable: 0,
      total: alquilerMes,
      category: 'operational',
      carencia: month <= carenciaAlquiler
    };
    
    // 3. PERSONAL ESCALADO POR TRIMESTRE
    const trimestreIndex = Math.min(Math.floor((month - 1) / 3), personalData.escalado.length - 1);
    const personalMes = personalData.escalado[trimestreIndex] || 0;
    totalCostsFijos += personalMes;
    costsBreakdown.personal = {
      name: 'PERSONAL',
      fixed: personalMes,
      variable: 0,
      total: personalMes,
      category: 'personnel',
      escalado_trimestre: trimestreIndex + 1
    };
    
    // 4. LEASING EQUIPOS (separado)
    const leasingMes = gastosDetallados.leasing_equipos || 0;
    totalCostsFijos += leasingMes;
    costsBreakdown.leasing = {
      name: 'LEASING EQUIPOS',
      fixed: leasingMes,
      variable: 0,
      total: leasingMes,
      category: 'equipment'
    };
    
    // 5. PUBLICIDAD INICIAL (solo mes 1)
    const publicidadMes = month === 1 ? publicidadInicial : 0;
    totalCostsFijos += publicidadMes;
    if (publicidadMes > 0) {
      costsBreakdown.publicidad_inicial = {
        name: 'PUBLICIDAD INICIAL',
        fixed: publicidadMes,
        variable: 0,
        total: publicidadMes,
        category: 'marketing',
        inicial: true
      };
    }
    
    // Costes operacionales profesionales
    fixedCosts.forEach(cost => {
      let monthlyFixed = cost.baseAmount || 0;
      let monthlyVariable = (cost.variableRate || 0) * clientesDelMes;
      
      // Aplicar estacionalidad si corresponde
      if (cost.hasSeasonality) {
        monthlyFixed *= seasonalFactor;
        monthlyVariable *= seasonalFactor;
      }
      
      totalCostsFijos += monthlyFixed;
      totalCostsVariables += monthlyVariable;
      
      costsBreakdown[cost.id] = {
        name: cost.name,
        fixed: monthlyFixed,
        variable: monthlyVariable,
        total: monthlyFixed + monthlyVariable,
        category: cost.category
      };
    });
    
    // Costes legacy (para compatibilidad)
    const legacyCosts = legacyFixedCosts.reduce((sum, cost) => sum + cost.value, 0);
    totalCostsFijos += legacyCosts;
    
    const totalCosts = totalCostsFijos + totalCostsVariables;
    const ebitda = ingresosDelMes - totalCosts;
    const ebitdaMargin = ingresosDelMes > 0 ? (ebitda / ingresosDelMes) * 100 : 0;
    
    projections.push({
      month,
      monthName,
      year: Math.ceil(month / 12),
      quarter: Math.ceil((month % 12 || 12) / 3),
      seasonalFactor,
      
      // Clientes
      clientesActuales: clientesDelMes,
      clientesNuevos: clientesData?.clientesNuevos || 0,
      clientesPerdidos: clientesData?.clientesPerdidos || 0,
      clientesNetos: (clientesData?.clientesNuevos || 0) - (clientesData?.clientesPerdidos || 0),
      
      // Ingresos detallados
      totalIngresos: ingresosDelMes,
      ingresosDetalle: ingresosData,
      
      // Costes detallados - NUEVO
      totalCostsFijos,
      totalCostsVariables,
      totalCosts,
      costsBreakdown,
      
      // P&L
      ebitda,
      ebitdaMargin,
      
      // Ratios operacionales
      costePorCliente: clientesDelMes > 0 ? totalCosts / clientesDelMes : 0,
      ingresosPorCliente: clientesDelMes > 0 ? ingresosDelMes / clientesDelMes : 0,
      margenContribucion: ingresosDelMes - totalCostsVariables,
      ratioIngresoCostes: totalCosts > 0 ? ingresosDelMes / totalCosts : 0,
      
      // Puntos de equilibrio
      breakEvenClientes: totalCostsFijos > 0 && clientesDelMes > 0 ? 
        totalCostsFijos / ((ingresosDelMes / clientesDelMes) - (totalCostsVariables / clientesDelMes)) : 0
    });
  }
  
  return projections;
};

// KPIS OPERACIONALES CON COSTES
FinancialCalculatorProfessional.prototype.calculateSectorKPIs = function(monthlyProjections, customerData, revenueConfig, costsConfig) {
  if (!monthlyProjections.length) return {};
  
  const year1Data = monthlyProjections.slice(0, 12);
  const benchmarks = this.businessModel?.operational_kpis || {};
  const costsMetrics = costsConfig ? this.calculateCostsMetrics(costsConfig) : {};
  
  // KPIs relacionados con costes
  const avgMonthlyCosts = year1Data.reduce((sum, p) => sum + p.totalCosts, 0) / 12;
  const avgMonthlyFixed = year1Data.reduce((sum, p) => sum + p.totalCostsFijos, 0) / 12;
  const avgMonthlyVariable = year1Data.reduce((sum, p) => sum + p.totalCostsVariables, 0) / 12;
  
  const calculatedKPIs = {
    // Eficiencia de costes
    coste_por_cliente: {
      value: year1Data.reduce((sum, p) => sum + (p.costePorCliente || 0), 0) / 12,
      target: benchmarks.coste_por_cliente?.target || 30,
      benchmark: benchmarks.coste_por_cliente?.benchmark_sector || 35,
      unit: '€/cliente',
      status: 'calculating'
    },
    
    // Estructura de costes
    ratio_costes_fijos_variables: {
      value: avgMonthlyFixed > 0 ? (avgMonthlyFixed / (avgMonthlyFixed + avgMonthlyVariable)) * 100 : 100,
      target: 70, // 70% fijo, 30% variable es típico para gimnasios
      benchmark: 75,
      unit: '% fijos',
      status: 'calculating'
    },
    
    // Escalabilidad
    elasticidad_costes: {
      value: this.calculateCostElasticity(year1Data),
      target: 0.3, // Por cada 1% más de clientes, costes suben 0.3%
      benchmark: 0.4,
      unit: 'elasticidad',
      status: 'calculating'
    },
    
    // Margen operacional
    margen_ebitda_promedio: {
      value: year1Data.reduce((sum, p) => sum + (p.ebitdaMargin || 0), 0) / 12,
      target: benchmarks.margen_ebitda?.target * 100 || 25,
      benchmark: benchmarks.margen_ebitda?.benchmark_sector * 100 || 22,
      unit: '%',
      status: 'calculating'
    },
    
    // Punto de equilibrio operacional
    punto_equilibrio_clientes: {
      value: year1Data.reduce((sum, p) => sum + (p.breakEvenClientes || 0), 0) / 12,
      target: customerData.proyeccionClientes?.[0]?.clientesActuales * 0.6 || 100,
      benchmark: customerData.proyeccionClientes?.[0]?.clientesActuales * 0.7 || 120,
      unit: 'clientes',
      status: 'calculating'
    }
  };
  
  // Calcular status para cada KPI
  Object.keys(calculatedKPIs).forEach(key => {
    const kpi = calculatedKPIs[key];
    const diffFromTarget = Math.abs(kpi.value - kpi.target) / kpi.target;
    
    if (diffFromTarget <= 0.1) {
      kpi.status = 'excellent';
    } else if (diffFromTarget <= 0.25) {
      kpi.status = 'good';
    } else if (diffFromTarget <= 0.5) {
      kpi.status = 'warning';
    } else {
      kpi.status = 'critical';
    }
  });
  
  return calculatedKPIs;
};

// ELASTICIDAD DE COSTES
FinancialCalculatorProfessional.prototype.calculateCostElasticity = function(monthlyData) {
  if (monthlyData.length < 2) return 0;
  
  const firstMonth = monthlyData[0];
  const lastMonth = monthlyData[monthlyData.length - 1];
  
  if (!firstMonth.clientesActuales || !firstMonth.totalCosts) return 0;
  
  const clienteChange = (lastMonth.clientesActuales - firstMonth.clientesActuales) / firstMonth.clientesActuales;
  const costChange = (lastMonth.totalCosts - firstMonth.totalCosts) / firstMonth.totalCosts;
  
  return clienteChange !== 0 ? Math.abs(costChange / clienteChange) : 0;
};