import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../utils/chartConfig'; // Importar configuración de Chart.js

const OperationalCosts = ({ 
  businessModel, 
  customerData,
  onCostsDataChange,
  initialData = null 
}) => {
  // Estado para gestión de costes operacionales
  const [costsData, setCostsData] = useState({
    fixedCosts: [],
    variableCosts: [],
    seasonalAdjustments: {},
    costProjections: []
  });

  // Inicializar datos basados en el modelo de negocio
  useEffect(() => {
    if (businessModel && !initialData) {
      const modelCosts = businessModel.gastos_mensuales_detallados || {};
      
      const fixedCostsFromModel = Object.entries(modelCosts).map(([key, value]) => ({
        id: key,
        name: key.replace('_', ' ').toUpperCase(),
        baseAmount: typeof value === 'number' ? value : (value.base || 0),
        variableRate: typeof value === 'object' ? value.variable_por_clientes || 0 : 0,
        category: getCostCategory(key),
        isEditable: true,
        hasSeasonality: ['marketing', 'publicidad', 'suministros'].includes(key),
        seasonalFactor: 1.0
      }));

      setCostsData(prev => ({
        ...prev,
        fixedCosts: fixedCostsFromModel
      }));
    } else if (initialData) {
      setCostsData(initialData);
    }
  }, [businessModel, initialData]);

  // Función para categorizar costes
  const getCostCategory = (key) => {
    const categories = {
      'alquiler': 'operational',
      'personal': 'personnel',
      'suministros': 'operational', 
      'seguros': 'legal',
      'gestoria': 'legal',
      'mantenimiento': 'operational',
      'licencias_musica': 'legal',
      'publicidad': 'marketing',
      'marketing': 'marketing',
      'otros_operativos': 'other'
    };
    return categories[key] || 'other';
  };

  // Calcular proyecciones mensuales de costes
  const monthlyProjections = useMemo(() => {
    if (!customerData || !costsData.fixedCosts.length) return [];

    const projections = [];
    const estacionalidad = businessModel?.customer_management?.estacionalidad || {};

    for (let month = 1; month <= 36; month++) {
      const monthName = new Date(2024, (month - 1) % 12).toLocaleString('es', { month: 'short' });
      const seasonalFactor = estacionalidad[Object.keys(estacionalidad)[(month - 1) % 12]] || 1.0;
      const clientesDelMes = customerData.monthlyEvolution ? 
        customerData.monthlyEvolution[month - 1]?.totalCustomers || 0 : 0;

      let totalFixed = 0;
      let totalVariable = 0;
      const costBreakdown = {};

      costsData.fixedCosts.forEach(cost => {
        // Coste fijo base
        let monthlyFixed = cost.baseAmount;
        
        // Coste variable por cliente
        let monthlyVariable = (cost.variableRate || 0) * clientesDelMes;
        
        // Ajuste estacional para costes específicos
        if (cost.hasSeasonality) {
          monthlyFixed *= seasonalFactor;
          monthlyVariable *= seasonalFactor;
        }

        totalFixed += monthlyFixed;
        totalVariable += monthlyVariable;
        
        costBreakdown[cost.id] = {
          fixed: monthlyFixed,
          variable: monthlyVariable,
          total: monthlyFixed + monthlyVariable
        };
      });

      projections.push({
        month,
        monthName,
        totalFixed,
        totalVariable,
        totalCosts: totalFixed + totalVariable,
        costBreakdown,
        seasonalFactor,
        clients: clientesDelMes
      });
    }

    return projections;
  }, [costsData, customerData, businessModel]);

  // Manejar cambio en coste fijo
  const handleFixedCostChange = (index, field, value) => {
    const updatedCosts = [...costsData.fixedCosts];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: field === 'baseAmount' || field === 'variableRate' ? 
        parseFloat(value) || 0 : value
    };
    
    const newCostsData = {
      ...costsData,
      fixedCosts: updatedCosts
    };
    
    setCostsData(newCostsData);
    onCostsDataChange && onCostsDataChange(newCostsData);
  };

  // Añadir nuevo coste
  const addNewCost = () => {
    const newCost = {
      id: `custom_${Date.now()}`,
      name: 'Nuevo Coste',
      baseAmount: 0,
      variableRate: 0,
      category: 'other',
      isEditable: true,
      hasSeasonality: false,
      seasonalFactor: 1.0
    };

    const updatedCosts = [...costsData.fixedCosts, newCost];
    const newCostsData = {
      ...costsData,
      fixedCosts: updatedCosts
    };
    
    setCostsData(newCostsData);
    onCostsDataChange && onCostsDataChange(newCostsData);
  };

  // Eliminar coste
  const removeCost = (index) => {
    const updatedCosts = costsData.fixedCosts.filter((_, i) => i !== index);
    const newCostsData = {
      ...costsData,
      fixedCosts: updatedCosts
    };
    
    setCostsData(newCostsData);
    onCostsDataChange && onCostsDataChange(newCostsData);
  };

  // Datos para gráfico de costes mensuales
  const monthlyCostsChartData = {
    labels: monthlyProjections.slice(0, 12).map(p => p.monthName),
    datasets: [
      {
        label: 'Costes Fijos',
        data: monthlyProjections.slice(0, 12).map(p => p.totalFixed),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'Costes Variables',
        data: monthlyProjections.slice(0, 12).map(p => p.totalVariable),
        backgroundColor: 'rgba(251, 146, 60, 0.5)',
        borderColor: 'rgb(251, 146, 60)',
        borderWidth: 2
      }
    ]
  };

  // Datos para gráfico de evolución 36 meses
  const evolutionChartData = {
    labels: monthlyProjections.map((p, i) => i % 3 === 0 ? `Mes ${p.month}` : ''),
    datasets: [
      {
        label: 'Costes Totales',
        data: monthlyProjections.map(p => p.totalCosts),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Calcular métricas de resumen
  const summaryMetrics = useMemo(() => {
    if (!monthlyProjections.length) return {};

    const year1Projections = monthlyProjections.slice(0, 12);
    const totalCostsYear1 = year1Projections.reduce((sum, p) => sum + p.totalCosts, 0);
    const avgMonthlyCosts = totalCostsYear1 / 12;
    const highestMonth = year1Projections.reduce((max, p) => 
      p.totalCosts > max.totalCosts ? p : max, year1Projections[0]);
    const lowestMonth = year1Projections.reduce((min, p) => 
      p.totalCosts < min.totalCosts ? p : min, year1Projections[0]);

    return {
      totalCostsYear1,
      avgMonthlyCosts,
      highestMonth,
      lowestMonth,
      variability: ((highestMonth.totalCosts - lowestMonth.totalCosts) / avgMonthlyCosts * 100).toFixed(1)
    };
  }, [monthlyProjections]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      operational: 'bg-blue-100 text-blue-800',
      personnel: 'bg-green-100 text-green-800',
      marketing: 'bg-purple-100 text-purple-800',
      legal: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  if (!businessModel) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Selecciona un modelo de negocio para configurar los gastos operacionales</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con métricas de resumen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gastos Operacionales</h2>
            <p className="text-gray-600 mt-1">
              Gestión detallada de costes fijos y variables para <strong>{businessModel.nombre}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Costes Año 1</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summaryMetrics.totalCostsYear1 || 0)}
            </div>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Promedio Mensual</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(summaryMetrics.avgMonthlyCosts || 0)}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Mes más Alto</div>
            <div className="font-semibold text-red-700">
              {summaryMetrics.highestMonth ? 
                `${summaryMetrics.highestMonth.monthName}: ${formatCurrency(summaryMetrics.highestMonth.totalCosts)}` : 
                'N/A'}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Mes más Bajo</div>
            <div className="font-semibold text-green-700">
              {summaryMetrics.lowestMonth ? 
                `${summaryMetrics.lowestMonth.monthName}: ${formatCurrency(summaryMetrics.lowestMonth.totalCosts)}` : 
                'N/A'}
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Variabilidad</div>
            <div className="font-semibold text-blue-700">
              ±{summaryMetrics.variability || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Costes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Estructura de Costes</h3>
          <button
            onClick={addNewCost}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            + Añadir Coste
          </button>
        </div>

        <div className="space-y-4">
          {costsData.fixedCosts.map((cost, index) => (
            <div key={cost.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={cost.name}
                    onChange={(e) => handleFixedCostChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!cost.isEditable}
                  />
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getCategoryColor(cost.category)}`}>
                    {cost.category}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coste Fijo (€/mes)
                  </label>
                  <input
                    type="number"
                    value={cost.baseAmount}
                    onChange={(e) => handleFixedCostChange(index, 'baseAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variable (€/cliente)
                  </label>
                  <input
                    type="number"
                    value={cost.variableRate || 0}
                    onChange={(e) => handleFixedCostChange(index, 'variableRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cost.hasSeasonality || false}
                      onChange={(e) => handleFixedCostChange(index, 'hasSeasonality', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Estacional</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => removeCost(index)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar coste"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de costes mensuales año 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Costes Mensuales (Año 1)
          </h3>
          <div className="h-80">
            <Bar 
              data={monthlyCostsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfico evolución 36 meses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución Costes (36 meses)
          </h3>
          <div className="h-80">
            <Line 
              data={evolutionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla de proyección detallada primer año */}
      {monthlyProjections.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Proyección Detallada (Primeros 12 meses)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Mes</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Clientes</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Costes Fijos</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Costes Variables</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Total Costes</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Factor Estacional</th>
                </tr>
              </thead>
              <tbody>
                {monthlyProjections.slice(0, 12).map((projection, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {projection.monthName} {Math.ceil(projection.month / 12) === 1 ? '2024' : '2025'}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {projection.clients.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(projection.totalFixed)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(projection.totalVariable)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatCurrency(projection.totalCosts)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500">
                      {(projection.seasonalFactor * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">TOTAL AÑO 1</td>
                  <td className="py-3 px-4 text-right">-</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(monthlyProjections.slice(0, 12).reduce((sum, p) => sum + p.totalFixed, 0))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(monthlyProjections.slice(0, 12).reduce((sum, p) => sum + p.totalVariable, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    {formatCurrency(summaryMetrics.totalCostsYear1 || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalCosts;