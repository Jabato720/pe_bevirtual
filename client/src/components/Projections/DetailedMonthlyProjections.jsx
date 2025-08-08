import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Table2, 
  LineChart, 
  BarChart3, 
  Home, 
  Target as TargetIcon, 
  Users, 
  Megaphone,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import '../../utils/chartConfig'; // Importar configuración de Chart.js

const DetailedMonthlyProjections = ({ 
  businessModel,
  professionalResults,
  timeFrame = 36 
}) => {
  const [activeView, setActiveView] = useState('table');
  const [selectedPeriod, setSelectedPeriod] = useState('year1');
  
  // Obtener proyecciones del resultado profesional
  const monthlyProjections = useMemo(() => {
    if (!professionalResults?.monthlyProjections) {
      return [];
    }
    
    const projections = professionalResults.monthlyProjections.slice(0, timeFrame);
    
    // Asegurar que tenemos los datos del Excel implementados
    return projections.map((projection, index) => {
      const month = index + 1;
      
      return {
        ...projection,
        month,
        // Datos específicos del Excel aplicados
        isCarencia: projection.costsBreakdown?.alquiler?.carencia || false,
        isPreVenta: month === 1 && projection.clientesNuevos >= 100,
        trimestrePersonal: projection.costsBreakdown?.personal?.escalado_trimestre || 1,
        hasPublicidadInicial: projection.costsBreakdown?.publicidad_inicial?.inicial || false
      };
    });
  }, [professionalResults, timeFrame]);

  // Filtrar por período
  const filteredProjections = useMemo(() => {
    if (selectedPeriod === 'year1') return monthlyProjections.slice(0, 12);
    if (selectedPeriod === 'year2') return monthlyProjections.slice(12, 24);
    if (selectedPeriod === 'year3') return monthlyProjections.slice(24, 36);
    return monthlyProjections;
  }, [monthlyProjections, selectedPeriod]);

  // Datos para gráficos
  const chartData = useMemo(() => {
    if (!filteredProjections.length) return null;
    
    return {
      labels: filteredProjections.map(p => `${p.monthName} ${Math.ceil(p.month / 12) + 2023}`),
      datasets: [
        {
          label: 'Ingresos',
          data: filteredProjections.map(p => p.totalIngresos || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2
        },
        {
          label: 'Costes Totales',
          data: filteredProjections.map(p => p.totalCosts || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        },
        {
          label: 'EBITDA',
          data: filteredProjections.map(p => p.ebitda || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        }
      ]
    };
  }, [filteredProjections]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getCellClass = (value, type = 'default') => {
    let baseClass = 'py-2 px-3 text-right font-medium';
    
    if (type === 'ebitda') {
      if (value > 0) return `${baseClass} text-green-700 bg-green-50`;
      if (value < 0) return `${baseClass} text-red-700 bg-red-50`;
    }
    
    if (type === 'carencia') {
      return `${baseClass} text-orange-700 bg-orange-50`;
    }
    
    if (type === 'escalado') {
      return `${baseClass} text-blue-700 bg-blue-50`;
    }
    
    return baseClass;
  };

  if (!businessModel || !professionalResults) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Configure primero los datos operacionales (Clientes, Ingresos, Gastos) para ver las proyecciones detalladas</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Header con controles */}
      <div className="section" style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: 'none'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Table2 className="w-6 h-6 text-gray-700" />
              Proyecciones Detalladas
            </h2>
            <p className="text-gray-600 mt-1">
              Análisis mensual estilo Excel bancario para <strong>{businessModel.nombre}</strong>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Selector período */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="year1">Año 1 (12 meses)</option>
              <option value="year2">Año 2 (meses 13-24)</option>
              <option value="year3">Año 3 (meses 25-36)</option>
              <option value="all">Todos (36 meses)</option>
            </select>
            
            {/* Selector vista */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setActiveView('table')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeView === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-l-lg border-r`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Tabla
              </button>
              <button
                onClick={() => setActiveView('chart')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeView === 'chart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-r-lg`}
              >
                <LineChart className="w-4 h-4 inline mr-1" />
                Gráfico
              </button>
            </div>
          </div>
        </div>

        {/* Indicadores especiales del Excel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="text-sm text-orange-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Carencia Alquiler
            </div>
            <div className="font-semibold text-orange-800">
              {businessModel.aspectos_temporales?.carencia_alquiler || 0} meses
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TargetIcon className="w-4 h-4" />
              Pre-venta
            </div>
            <div className="font-semibold text-green-800">
              {businessModel.aspectos_temporales?.pre_ventas_apertura || 0} clientes
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Personal Escalado
            </div>
            <div className="font-semibold text-blue-800">
              Por trimestre
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-600 flex items-center gap-1">
              <Megaphone className="w-4 h-4" />
              Publicidad Inicial
            </div>
            <div className="font-semibold text-purple-800">
              {formatCurrency(businessModel.gastos_mensuales_detallados?.publicidad_inicial || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Vista Tabla Transpuesta - Estilo Excel Profesional */}
      {activeView === 'table' && (
        <div className="section" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 'none',
          overflow: 'hidden'
        }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[160px]">
                    Concepto
                  </th>
                  {filteredProjections.map((projection, index) => (
                    <th key={index} className="py-3 px-3 text-center font-semibold text-gray-700 min-w-[100px] border-l border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-xs">
                          {projection.monthName?.substring(0, 3)}
                        </span>
                        <span className="text-xs text-gray-500">
                          '{String(Math.ceil(projection.month / 12) + 23).slice(-2)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* Clientes Nuevos */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Clientes Nuevos
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className="py-2 px-3 text-right border-l border-gray-100">
                      <span className={projection.isPreVenta ? 'text-green-600 font-semibold' : ''}>
                        {projection.clientesNuevos?.toLocaleString() || 0}
                      </span>
                      {projection.isPreVenta && (
                        <div className="text-xs text-green-600">Pre-venta</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Clientes Bajas */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Clientes Bajas
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className="py-2 px-3 text-right text-red-600 border-l border-gray-100">
                      {projection.clientesPerdidos?.toLocaleString() || 0}
                    </td>
                  ))}
                </tr>

                {/* Total Clientes */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 bg-blue-25">
                  <td className="py-2 px-4 font-semibold text-gray-900 sticky left-0 bg-blue-25 z-10 border-r border-gray-200">
                    Total Clientes
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className="py-2 px-3 text-right font-semibold text-blue-700 border-l border-gray-100">
                      {projection.clientesActuales?.toLocaleString() || 0}
                    </td>
                  ))}
                </tr>

                {/* Separador */}
                <tr className="border-b-2 border-gray-300">
                  <td colSpan={filteredProjections.length + 1} className="py-1"></td>
                </tr>

                {/* Ingresos Totales */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 bg-green-25">
                  <td className="py-2 px-4 font-semibold text-gray-900 sticky left-0 bg-green-25 z-10 border-r border-gray-200">
                    Ingresos Totales
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className="py-2 px-3 text-right font-semibold text-green-700 border-l border-gray-100">
                      {formatCurrency(projection.totalIngresos || 0)}
                    </td>
                  ))}
                </tr>

                {/* Separador */}
                <tr className="border-b-2 border-gray-300">
                  <td colSpan={filteredProjections.length + 1} className="py-1"></td>
                </tr>

                {/* Alquiler */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Alquiler
                  </td>
                  {filteredProjections.map((projection, index) => {
                    const alquiler = projection.costsBreakdown?.alquiler?.total || 0;
                    return (
                      <td key={index} className="py-2 px-3 text-right border-l border-gray-100">
                        <span className={projection.isCarencia ? 'text-orange-600 font-medium' : ''}>
                          {formatCurrency(alquiler)}
                        </span>
                        {projection.isCarencia && (
                          <div className="text-xs text-orange-600">Carencia</div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Personal */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Personal
                  </td>
                  {filteredProjections.map((projection, index) => {
                    const personal = projection.costsBreakdown?.personal?.total || 0;
                    return (
                      <td key={index} className="py-2 px-3 text-right border-l border-gray-100">
                        <span className="text-blue-600 font-medium">
                          {formatCurrency(personal)}
                        </span>
                        <div className="text-xs text-blue-600">
                          T{projection.trimestrePersonal}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Otros Costes Fijos */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Otros Costes Fijos
                  </td>
                  {filteredProjections.map((projection, index) => {
                    const alquiler = projection.costsBreakdown?.alquiler?.total || 0;
                    const personal = projection.costsBreakdown?.personal?.total || 0;
                    const otrosFijos = projection.totalCostsFijos - alquiler - personal;
                    return (
                      <td key={index} className="py-2 px-3 text-right border-l border-gray-100">
                        {formatCurrency(otrosFijos)}
                        {projection.hasPublicidadInicial && (
                          <div className="text-xs text-purple-600">+Pub. inicial</div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Costes */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 bg-red-25">
                  <td className="py-2 px-4 font-semibold text-gray-900 sticky left-0 bg-red-25 z-10 border-r border-gray-200">
                    Total Costes
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className="py-2 px-3 text-right font-semibold text-red-700 border-l border-gray-100">
                      {formatCurrency(projection.totalCosts || 0)}
                    </td>
                  ))}
                </tr>

                {/* Separador */}
                <tr className="border-b-2 border-gray-300">
                  <td colSpan={filteredProjections.length + 1} className="py-1"></td>
                </tr>

                {/* EBITDA */}
                <tr className="border-b border-gray-200 hover:bg-gray-50 bg-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-900 sticky left-0 bg-gray-100 z-10 border-r border-gray-200">
                    EBITDA
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className={`py-3 px-3 text-right font-bold border-l border-gray-100 ${
                      projection.ebitda >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(projection.ebitda || 0)}
                    </td>
                  ))}
                </tr>

                {/* Margen EBITDA */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    Margen EBITDA
                  </td>
                  {filteredProjections.map((projection, index) => (
                    <td key={index} className={`py-2 px-3 text-right font-medium border-l border-gray-100 ${
                      projection.ebitdaMargin >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(projection.ebitdaMargin || 0)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Gráfico */}
      {activeView === 'chart' && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '30px' }}>
          <div className="section" style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: 'none'
          }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              Evolución Mensual - {selectedPeriod === 'year1' ? 'Año 1' : selectedPeriod === 'year2' ? 'Año 2' : selectedPeriod === 'year3' ? 'Año 3' : 'Todos'}
            </h3>
            <div className="h-80">
              <Line 
                data={chartData}
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

          <div className="section" style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: 'none'
          }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              Comparación Mensual
            </h3>
            <div className="h-80">
              <Bar 
                data={chartData}
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
      )}

      {/* Resumen de métricas clave */}
      {filteredProjections.length > 0 && (
        <div className="section" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 'none'
        }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gray-700" />
            Métricas Clave del Período
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredProjections.reduce((sum, p) => sum + (p.totalIngresos || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Ingresos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(filteredProjections.reduce((sum, p) => sum + (p.totalCosts || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Costes Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(filteredProjections.reduce((sum, p) => sum + (p.ebitda || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">EBITDA Período</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {filteredProjections[filteredProjections.length - 1]?.clientesActuales?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600">Clientes Final</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedMonthlyProjections;