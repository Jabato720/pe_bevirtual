import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import '../../utils/chartConfig'; // Importar configuración de Chart.js

const CustomerManagementSystem = ({ 
  businessModel, 
  onCustomerDataChange,
  initialData = null 
}) => {
  // Estado para gestión de clientes
  const [customerData, setCustomerData] = useState({
    crecimiento_mensual_base: businessModel?.customer_management?.crecimiento_mensual_promedio || 50,
    tasa_abandono_mensual: (businessModel?.customer_management?.tasa_abandono_mensual || 0.05) * 100,
    clientes_iniciales: businessModel?.customer_management?.clientes_iniciales || 0,
    conversion_prueba_gratuita: (businessModel?.customer_management?.conversion_prueba_gratuita || 0.20) * 100,
    objetivo_clientes_ano1: businessModel?.customer_management?.clientes_objetivo_ano1 || 500,
    estacionalidad_personalizada: false,
    ...initialData
  });

  // Factores de estacionalidad del modelo
  const estacionalidadModelo = businessModel?.customer_management?.estacionalidad || {
    enero: 1.0, febrero: 1.0, marzo: 1.0, abril: 1.0,
    mayo: 1.0, junio: 1.0, julio: 1.0, agosto: 1.0,
    septiembre: 1.0, octubre: 1.0, noviembre: 1.0, diciembre: 1.0
  };

  const [estacionalidad, setEstacionalidad] = useState(estacionalidadModelo);

  // Calcular proyección de clientes
  const proyeccionClientes = useMemo(() => {
    const proyeccion = [];
    let clientesActuales = customerData.clientes_iniciales;
    
    for (let mes = 1; mes <= 36; mes++) {
      const mesCalendario = ((mes - 1) % 12);
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const factorEstacional = estacionalidad[meses[mesCalendario]] || 1.0;
      
      // Clientes nuevos con estacionalidad
      const clientesNuevos = Math.round(customerData.crecimiento_mensual_base * factorEstacional);
      
      // Clientes que se van (churn)
      const clientesPerdidos = Math.round(clientesActuales * (customerData.tasa_abandono_mensual / 100));
      
      // Clientes netos
      const clientesNetos = clientesNuevos - clientesPerdidos;
      clientesActuales += clientesNetos;
      
      // Evitar números negativos
      clientesActuales = Math.max(0, clientesActuales);
      
      proyeccion.push({
        mes,
        año: Math.ceil(mes / 12),
        mesNombre: meses[mesCalendario],
        clientesNuevos,
        clientesPerdidos,
        clientesNetos,
        clientesActuales,
        factorEstacional,
        tasaRetencion: clientesActuales > 0 ? ((clientesActuales - clientesNuevos + clientesPerdidos) / clientesActuales) : 0,
        crecimientoMensual: mes > 1 ? ((clientesActuales - proyeccion[mes-2].clientesActuales) / proyeccion[mes-2].clientesActuales) * 100 : 0
      });
    }
    
    return proyeccion;
  }, [customerData, estacionalidad]);

  // Métricas calculadas
  const metricas = useMemo(() => {
    const proyeccionAno1 = proyeccionClientes.slice(0, 12);
    const clientesAno1 = proyeccionAno1[proyeccionAno1.length - 1]?.clientesActuales || 0;
    const totalNuevosAno1 = proyeccionAno1.reduce((sum, p) => sum + p.clientesNuevos, 0);
    const totalPerdidosAno1 = proyeccionAno1.reduce((sum, p) => sum + p.clientesPerdidos, 0);
    const tasaRetencionPromedio = proyeccionAno1.reduce((sum, p) => sum + p.tasaRetencion, 0) / proyeccionAno1.length;
    
    return {
      clientesAno1,
      totalNuevosAno1,
      totalPerdidosAno1,
      tasaRetencionPromedio: tasaRetencionPromedio * 100,
      cumpleObjetivo: clientesAno1 >= customerData.objetivo_clientes_ano1,
      diferenciaDobjetivo: clientesAno1 - customerData.objetivo_clientes_ano1,
      mesAlcanceObjetivo: proyeccionClientes.find(p => p.clientesActuales >= customerData.objetivo_clientes_ano1)?.mes || null
    };
  }, [proyeccionClientes, customerData.objetivo_clientes_ano1]);

  // Datos para gráficos
  const chartData = {
    labels: proyeccionClientes.slice(0, 12).map(p => p.mesNombre),
    datasets: [
      {
        label: 'Clientes Nuevos',
        data: proyeccionClientes.slice(0, 12).map(p => p.clientesNuevos),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      },
      {
        label: 'Clientes Perdidos',
        data: proyeccionClientes.slice(0, 12).map(p => -p.clientesPerdidos),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  };

  const clientesTotalChart = {
    labels: proyeccionClientes.slice(0, 12).map(p => p.mesNombre),
    datasets: [
      {
        label: 'Total Clientes',
        data: proyeccionClientes.slice(0, 12).map(p => p.clientesActuales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Manejar cambios
  const handleInputChange = (field, value) => {
    const newData = {
      ...customerData,
      [field]: value
    };
    setCustomerData(newData);
    
    if (onCustomerDataChange) {
      onCustomerDataChange({
        customerData: newData,
        proyeccionClientes,
        metricas
      });
    }
  };

  const handleEstacionalidadChange = (mes, factor) => {
    const newEstacionalidad = {
      ...estacionalidad,
      [mes]: factor
    };
    setEstacionalidad(newEstacionalidad);
  };

  const resetEstacionalidad = () => {
    setEstacionalidad(estacionalidadModelo);
    setCustomerData(prev => ({ ...prev, estacionalidad_personalizada: false }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Gestión de Clientes</h2>
        <p className="text-blue-100">
          Proyección operacional detallada • {businessModel?.nombre || 'Modelo personalizado'}
        </p>
      </div>

      {/* Configuración base */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Parámetros Base de Crecimiento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clientes Iniciales
            </label>
            <input
              type="number"
              value={customerData.clientes_iniciales}
              onChange={(e) => handleInputChange('clientes_iniciales', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crecimiento Mensual Base
            </label>
            <input
              type="number"
              value={customerData.crecimiento_mensual_base}
              onChange={(e) => handleInputChange('crecimiento_mensual_base', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Nuevos clientes por mes (promedio)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasa Abandono Mensual (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={customerData.tasa_abandono_mensual}
              onChange={(e) => handleInputChange('tasa_abandono_mensual', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">% de clientes que se van cada mes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conversión Prueba Gratuita (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={customerData.conversion_prueba_gratuita}
              onChange={(e) => handleInputChange('conversion_prueba_gratuita', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo Clientes Año 1
            </label>
            <input
              type="number"
              value={customerData.objetivo_clientes_ano1}
              onChange={(e) => handleInputChange('objetivo_clientes_ano1', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${metricas.cumpleObjetivo ? 'border-green-500' : 'border-red-500'}`}>
          <h4 className="text-sm font-medium text-gray-600">Clientes Año 1</h4>
          <p className="text-2xl font-bold text-gray-900">{metricas.clientesAno1.toLocaleString()}</p>
          <p className={`text-xs ${metricas.cumpleObjetivo ? 'text-green-600' : 'text-red-600'}`}>
            {metricas.cumpleObjetivo ? '✓' : '✗'} Objetivo: {customerData.objetivo_clientes_ano1.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600">Nuevos Clientes/Año</h4>
          <p className="text-2xl font-bold text-gray-900">{metricas.totalNuevosAno1.toLocaleString()}</p>
          <p className="text-xs text-blue-600">Captaciones totales</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h4 className="text-sm font-medium text-gray-600">Tasa Retención</h4>
          <p className="text-2xl font-bold text-gray-900">{metricas.tasaRetencionPromedio.toFixed(1)}%</p>
          <p className="text-xs text-orange-600">Promedio anual</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-600">Mes Objetivo</h4>
          <p className="text-2xl font-bold text-gray-900">
            {metricas.mesAlcanceObjetivo ? `Mes ${metricas.mesAlcanceObjetivo}` : 'No alcanzado'}
          </p>
          <p className="text-xs text-purple-600">Alcance del objetivo</p>
        </div>
      </div>

      {/* Estacionalidad */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Factores de Estacionalidad
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setCustomerData(prev => ({ ...prev, estacionalidad_personalizada: !prev.estacionalidad_personalizada }))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                customerData.estacionalidad_personalizada
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {customerData.estacionalidad_personalizada ? 'Personalizado' : 'Usar del sector'}
            </button>
            {customerData.estacionalidad_personalizada && (
              <button
                onClick={resetEstacionalidad}
                className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600"
              >
                Resetear
              </button>
            )}
          </div>
        </div>

        {customerData.estacionalidad_personalizada ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(estacionalidad).map(mes => (
              <div key={mes}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {mes}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={estacionalidad[mes]}
                  onChange={(e) => handleEstacionalidadChange(mes, parseFloat(e.target.value) || 1.0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  {((estacionalidad[mes] - 1) * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(estacionalidad).map(mes => (
              <div key={mes} className="text-center p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 capitalize">{mes}</p>
                <p className="text-lg font-bold text-gray-900">{estacionalidad[mes].toFixed(1)}</p>
                <p className="text-xs text-gray-500">
                  {((estacionalidad[mes] - 1) * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico altas/bajas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Altas vs Bajas Mensuales</h3>
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                }
              }}
            />
          </div>
        </div>

        {/* Gráfico evolución total */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Total Clientes</h3>
          <div className="h-64">
            <Line
              data={clientesTotalChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyección Detallada - Año 1</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nuevos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perdidos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Netos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retención</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estacionalidad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proyeccionClientes.slice(0, 12).map((periodo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {periodo.mesNombre}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    +{periodo.clientesNuevos}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    -{periodo.clientesPerdidos}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                    periodo.clientesNetos >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {periodo.clientesNetos >= 0 ? '+' : ''}{periodo.clientesNetos}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {periodo.clientesActuales.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {(periodo.tasaRetencion * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {(periodo.factorEstacional * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementSystem;