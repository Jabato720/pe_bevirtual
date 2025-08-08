import React, { useState, useMemo } from 'react';
import { Radar, Bar } from 'react-chartjs-2';
import '../../utils/chartConfig'; // Importar configuración de Chart.js

const OperationalKPIs = ({ 
  businessModel, 
  customerData,
  revenueData,
  onKPIDataChange,
  initialData = null 
}) => {
  // Estado para configuración de KPIs
  const [kpiConfig, setKpiConfig] = useState({
    use_benchmarks: true,
    custom_targets: false,
    show_critical_only: false,
    alert_threshold: 'warning', // warning, critical
    ...initialData
  });

  // KPIs operacionales del sector
  const sectorialKPIs = businessModel?.operational_kpis || {};

  // Calcular KPIs actuales basados en datos operacionales
  const calculatedKPIs = useMemo(() => {
    if (!customerData?.proyeccionClientes || !revenueData?.proyeccionIngresos) {
      return {};
    }

    const proyeccionAno1 = customerData.proyeccionClientes.slice(0, 12);
    const ingresosAno1 = revenueData.proyeccionIngresos.slice(0, 12);
    
    const kpis = {};

    // GIMNASIO KPIs
    if (businessModel?.id === 'gimnasio-fitness') {
      // Tasa de retención
      const retencionPromedio = proyeccionAno1.reduce((sum, p) => sum + (p.tasaRetencion || 0), 0) / proyeccionAno1.length;
      kpis.tasa_retencion = {
        value: retencionPromedio,
        target: sectorialKPIs.tasa_retencion?.target || 0.75,
        benchmark: sectorialKPIs.tasa_retencion?.benchmark_sector || 0.70,
        critical: sectorialKPIs.tasa_retencion?.critical || 0.60,
        unit: 'percentage',
        label: 'Tasa de Retención'
      };

      // Ingresos por cliente (ARPU)
      const clientesPromedio = proyeccionAno1.reduce((sum, p) => sum + p.clientesActuales, 0) / proyeccionAno1.length;
      const ingresosPromedio = ingresosAno1.reduce((sum, p) => sum + p.totalIngresos, 0) / ingresosAno1.length;
      const arpu = clientesPromedio > 0 ? ingresosPromedio / clientesPromedio : 0;
      
      kpis.ingresos_por_cliente = {
        value: arpu,
        target: sectorialKPIs.ingresos_por_cliente?.target || 45,
        benchmark: sectorialKPIs.ingresos_por_cliente?.benchmark_sector || 42,
        critical: sectorialKPIs.ingresos_por_cliente?.critical || 30,
        unit: 'currency',
        label: 'Ingresos por Cliente'
      };

      // Ocupación promedio (clientes/capacidad)
      const capacidadMaxima = businessModel.aspectos_temporales?.capacidad_maxima || 1200;
      const ocupacionPromedio = clientesPromedio / capacidadMaxima;
      
      kpis.ocupacion_promedio = {
        value: ocupacionPromedio,
        target: sectorialKPIs.ocupacion_promedio?.target || 0.70,
        benchmark: sectorialKPIs.ocupacion_promedio?.benchmark_sector || 0.65,
        critical: sectorialKPIs.ocupacion_promedio?.critical || 0.50,
        unit: 'percentage',
        label: 'Ocupación Promedio'
      };
    }

    // RESTAURANTE KPIs
    if (businessModel?.id === 'restaurante') {
      // Ticket medio
      const ventasComida = ingresosAno1.reduce((sum, p) => sum + (p.ingresosPorStream?.ventas_comida || 0), 0);
      const diasAno = 365;
      const comensalesDia = businessModel.customer_management?.comensales_dia_promedio || 45;
      const ticketMedio = ventasComida / (diasAno * comensalesDia);

      kpis.ticket_medio = {
        value: ticketMedio,
        target: sectorialKPIs.ticket_medio?.target || 25,
        benchmark: sectorialKPIs.ticket_medio?.benchmark_sector || 23,
        critical: sectorialKPIs.ticket_medio?.critical || 15,
        unit: 'currency',
        label: 'Ticket Medio'
      };

      // Rotación de mesas
      kpis.rotacion_mesas = {
        value: businessModel.customer_management?.rotacion_mesas || 2.5,
        target: sectorialKPIs.rotacion_mesas?.target || 3,
        benchmark: sectorialKPIs.rotacion_mesas?.benchmark_sector || 2.5,
        critical: sectorialKPIs.rotacion_mesas?.critical || 2,
        unit: 'number',
        label: 'Rotación de Mesas'
      };

      // Margen bebidas
      const ingresosBebidas = ingresosAno1.reduce((sum, p) => sum + (p.ingresosPorStream?.bebidas || 0), 0);
      const margenBebidas = ingresosBebidas > 0 ? 0.65 : 0; // Mock calculation

      kpis.margen_bebidas = {
        value: margenBebidas,
        target: sectorialKPIs.margen_bebidas?.target || 0.65,
        benchmark: sectorialKPIs.margen_bebidas?.benchmark_sector || 0.60,
        critical: sectorialKPIs.margen_bebidas?.critical || 0.50,
        unit: 'percentage',
        label: 'Margen Bebidas'
      };
    }

    // E-COMMERCE KPIs
    if (businessModel?.id === 'ecommerce-profesional') {
      // Conversion rate
      const conversionRate = businessModel.revenue_streams?.ventas_productos?.conversion_rate_base || 0.025;
      
      kpis.conversion_rate = {
        value: conversionRate,
        target: sectorialKPIs.conversion_rate?.target || 0.030,
        benchmark: sectorialKPIs.conversion_rate?.benchmark_sector || 0.025,
        critical: sectorialKPIs.conversion_rate?.critical || 0.015,
        unit: 'percentage',
        label: 'Tasa de Conversión'
      };

      // AOV (Average Order Value)
      const aov = businessModel.revenue_streams?.ventas_productos?.aov_base || 65;
      
      kpis.aov = {
        value: aov,
        target: sectorialKPIs.aov?.target || 70,
        benchmark: sectorialKPIs.aov?.benchmark_sector || 65,
        critical: sectorialKPIs.aov?.critical || 45,
        unit: 'currency',
        label: 'Valor Medio Pedido'
      };

      // CAC/LTV Ratio
      const cac = businessModel.customer_management?.cac_pago || 35;
      const ltv = businessModel.customer_management?.ltv_promedio || 180;
      const cacLtvRatio = cac / ltv;

      kpis.cac_ltv_ratio = {
        value: cacLtvRatio,
        target: sectorialKPIs.cac_ltv_ratio?.target || 0.20,
        benchmark: sectorialKPIs.cac_ltv_ratio?.benchmark_sector || 0.25,
        critical: sectorialKPIs.cac_ltv_ratio?.critical || 0.35,
        unit: 'ratio',
        label: 'Ratio CAC/LTV',
        inverted: true // Menor es mejor
      };
    }

    // HOTEL KPIs
    if (businessModel?.id === 'hotel-rural') {
      // Ocupación promedio
      const ocupacionObjetivo = businessModel.customer_management?.ocupacion_objetivo || 0.65;
      
      kpis.ocupacion_promedio = {
        value: ocupacionObjetivo,
        target: sectorialKPIs.ocupacion_promedio?.target || 0.65,
        benchmark: sectorialKPIs.ocupacion_promedio?.benchmark_sector || 0.60,
        critical: sectorialKPIs.ocupacion_promedio?.critical || 0.40,
        unit: 'percentage',
        label: 'Ocupación Promedio'
      };

      // RevPAR (Revenue Per Available Room)
      const precioHabitacion = businessModel.revenue_streams?.habitaciones?.precio_habitacion_base || 120;
      const revpar = precioHabitacion * ocupacionObjetivo;

      kpis.revpar = {
        value: revpar,
        target: sectorialKPIs.revpar?.target || 78,
        benchmark: sectorialKPIs.revpar?.benchmark_sector || 72,
        critical: sectorialKPIs.revpar?.critical || 50,
        unit: 'currency',
        label: 'RevPAR'
      };

      // ADR (Average Daily Rate)
      kpis.adr = {
        value: precioHabitacion,
        target: sectorialKPIs.adr?.target || 120,
        benchmark: sectorialKPIs.adr?.benchmark_sector || 115,
        critical: sectorialKPIs.adr?.critical || 80,
        unit: 'currency',
        label: 'Precio Medio Habitación'
      };
    }

    // CONSULTORÍA KPIs
    if (businessModel?.id === 'consultoria-profesional') {
      // Margen bruto
      const margenBruto = 0.70; // Mock calculation
      
      kpis.margen_bruto = {
        value: margenBruto,
        target: sectorialKPIs.margen_bruto?.target || 0.70,
        benchmark: sectorialKPIs.margen_bruto?.benchmark_sector || 0.65,
        critical: sectorialKPIs.margen_bruto?.critical || 0.55,
        unit: 'percentage',
        label: 'Margen Bruto'
      };

      // Horas facturables
      const horasFacturables = businessModel.revenue_streams?.consultoria_horas?.horas_facturables_mes || 120;
      
      kpis.horas_facturables = {
        value: horasFacturables,
        target: sectorialKPIs.horas_facturables?.target || 120,
        benchmark: sectorialKPIs.horas_facturables?.benchmark_sector || 110,
        critical: sectorialKPIs.horas_facturables?.critical || 90,
        unit: 'hours',
        label: 'Horas Facturables/Mes'
      };

      // Precio hora promedio
      const precioHoraJunior = businessModel.revenue_streams?.consultoria_horas?.precio_hora_junior || 65;
      const precioHoraSenior = businessModel.revenue_streams?.consultoria_horas?.precio_hora_senior || 95;
      const precioHoraPromedio = (precioHoraJunior + precioHoraSenior) / 2;

      kpis.precio_hora_promedio = {
        value: precioHoraPromedio,
        target: sectorialKPIs.precio_hora_promedio?.target || 85,
        benchmark: sectorialKPIs.precio_hora_promedio?.benchmark_sector || 80,
        critical: sectorialKPIs.precio_hora_promedio?.critical || 65,
        unit: 'currency',
        label: 'Precio Hora Promedio'
      };
    }

    return kpis;
  }, [businessModel, customerData, revenueData]);

  // Determinar estatus de cada KPI
  const getKPIStatus = (kpi) => {
    if (!kpi) return 'unknown';
    
    const { value, target, benchmark, critical, inverted = false } = kpi;
    
    if (inverted) {
      // Para KPIs donde menor es mejor
      if (value <= target) return 'excellent';
      if (value <= benchmark) return 'good';
      if (value <= critical) return 'warning';
      return 'critical';
    } else {
      // Para KPIs donde mayor es mejor
      if (value >= target) return 'excellent';
      if (value >= benchmark) return 'good';
      if (value >= critical) return 'warning';
      return 'critical';
    }
  };

  // Formatear valores
  const formatValue = (kpi) => {
    if (!kpi) return 'N/A';
    
    const { value, unit } = kpi;
    
    switch (unit) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0
        }).format(value);
      case 'hours':
        return `${value.toFixed(0)}h`;
      case 'ratio':
        return value.toFixed(3);
      case 'number':
      default:
        return value.toFixed(1);
    }
  };

  // Colores por estatus
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'warning': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  // Datos para gráfico radar
  const radarChartData = {
    labels: Object.values(calculatedKPIs).map(kpi => kpi.label),
    datasets: [
      {
        label: 'Actual',
        data: Object.values(calculatedKPIs).map(kpi => {
          // Normalizar valores para el radar (0-100)
          const normalizedValue = kpi.unit === 'percentage' 
            ? kpi.value * 100 
            : (kpi.value / kpi.target) * 100;
          return Math.min(normalizedValue, 150); // Cap at 150%
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      },
      {
        label: 'Target',
        data: Object.values(calculatedKPIs).map(() => 100), // Target = 100%
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff'
      },
      {
        label: 'Benchmark Sector',
        data: Object.values(calculatedKPIs).map(kpi => {
          const benchmarkNormalized = kpi.unit === 'percentage' 
            ? (kpi.benchmark / kpi.target) * 100
            : (kpi.benchmark / kpi.target) * 100;
          return benchmarkNormalized;
        }),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: '#fff'
      }
    ]
  };

  // Resumen de performance
  const performanceSummary = useMemo(() => {
    const kpiArray = Object.values(calculatedKPIs);
    const totalKPIs = kpiArray.length;
    
    const statusCounts = kpiArray.reduce((acc, kpi) => {
      const status = getKPIStatus(kpi);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const overallScore = kpiArray.reduce((sum, kpi) => {
      const status = getKPIStatus(kpi);
      const points = { excellent: 4, good: 3, warning: 2, critical: 1, unknown: 0 };
      return sum + points[status];
    }, 0);

    const maxScore = totalKPIs * 4;
    const overallPercentage = totalKPIs > 0 ? (overallScore / maxScore) * 100 : 0;

    let overallRating = 'Crítico';
    if (overallPercentage >= 90) overallRating = 'Excelente';
    else if (overallPercentage >= 75) overallRating = 'Bueno';
    else if (overallPercentage >= 50) overallRating = 'Regular';

    return {
      totalKPIs,
      statusCounts,
      overallScore,
      overallPercentage,
      overallRating
    };
  }, [calculatedKPIs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">KPIs Operacionales</h2>
        <p className="text-purple-100">
          Benchmarking automático vs sector • {businessModel?.nombre || 'Modelo personalizado'}
        </p>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-600">Rating General</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.overallRating}</p>
          <p className="text-xs text-purple-600">{performanceSummary.overallPercentage.toFixed(0)}% del objetivo</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-600">Excelentes</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.statusCounts.excellent || 0}</p>
          <p className="text-xs text-green-600">Por encima del target</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600">Buenos</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.statusCounts.good || 0}</p>
          <p className="text-xs text-blue-600">Por encima del benchmark</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h4 className="text-sm font-medium text-gray-600">En Alerta</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.statusCounts.warning || 0}</p>
          <p className="text-xs text-orange-600">Por debajo del benchmark</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <h4 className="text-sm font-medium text-gray-600">Críticos</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceSummary.statusCounts.critical || 0}</p>
          <p className="text-xs text-red-600">Por debajo del mínimo</p>
        </div>
      </div>

      {/* Gráfico Radar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Comparativo</h3>
        <div className="h-96 flex items-center justify-center">
          {Object.keys(calculatedKPIs).length > 0 ? (
            <Radar
              data={radarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 150,
                    ticks: {
                      stepSize: 25
                    }
                  }
                }
              }}
            />
          ) : (
            <p className="text-gray-500">Configure los datos operacionales para ver el análisis</p>
          )}
        </div>
      </div>

      {/* KPIs Detallados */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">KPIs Detallados por Sector</h3>
        
        {Object.keys(calculatedKPIs).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay KPIs disponibles</h3>
            <p className="text-gray-500">
              Configure los datos de cliente y ingresos para ver los KPIs operacionales específicos del sector.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(calculatedKPIs).map(([key, kpi]) => {
              const status = getKPIStatus(kpi);
              const statusColor = getStatusColor(status);
              
              return (
                <div key={key} className={`border-2 border-${statusColor}-200 rounded-lg p-4 bg-${statusColor}-50`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 text-sm">{kpi.label}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
                      {status === 'excellent' && '⭐ Excelente'}
                      {status === 'good' && '✅ Bueno'}
                      {status === 'warning' && '⚠️ Alerta'}
                      {status === 'critical' && '🔴 Crítico'}
                      {status === 'unknown' && '❓ N/A'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Actual:</span>
                      <span className="text-sm font-bold text-gray-900">{formatValue(kpi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Target:</span>
                      <span className="text-sm text-green-600">{formatValue({...kpi, value: kpi.target})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Sector:</span>
                      <span className="text-sm text-orange-600">{formatValue({...kpi, value: kpi.benchmark})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Mínimo:</span>
                      <span className="text-sm text-red-600">{formatValue({...kpi, value: kpi.critical})}</span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${statusColor}-500 h-2 rounded-full transition-all duration-500`}
                        style={{ 
                          width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Configuración */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de KPIs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="use_benchmarks"
              checked={kpiConfig.use_benchmarks}
              onChange={(e) => setKpiConfig(prev => ({ ...prev, use_benchmarks: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="use_benchmarks" className="ml-2 block text-sm text-gray-900">
              Usar benchmarks del sector
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="custom_targets"
              checked={kpiConfig.custom_targets}
              onChange={(e) => setKpiConfig(prev => ({ ...prev, custom_targets: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="custom_targets" className="ml-2 block text-sm text-gray-900">
              Targets personalizados
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show_critical_only"
              checked={kpiConfig.show_critical_only}
              onChange={(e) => setKpiConfig(prev => ({ ...prev, show_critical_only: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="show_critical_only" className="ml-2 block text-sm text-gray-900">
              Solo críticos
            </label>
          </div>
          
          <div>
            <label htmlFor="alert_threshold" className="block text-sm font-medium text-gray-700 mb-1">
              Umbral alertas
            </label>
            <select
              id="alert_threshold"
              value={kpiConfig.alert_threshold}
              onChange={(e) => setKpiConfig(prev => ({ ...prev, alert_threshold: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalKPIs;