import React, { useState, useEffect, useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import '../../utils/chartConfig'; // Importar configuración de Chart.js

const MultipleRevenueStreams = ({ 
  businessModel, 
  customerData,
  onRevenueDataChange,
  initialData = null 
}) => {
  // Estado para múltiples fuentes de ingresos
  const [revenueConfig, setRevenueConfig] = useState({
    streams: businessModel?.revenue_streams || {},
    customStreams: [],
    configuracion_personalizada: false,
    ...initialData
  });

  // Proyección de ingresos mensuales
  const proyeccionIngresos = useMemo(() => {
    if (!customerData?.proyeccionClientes) return [];
    
    return customerData.proyeccionClientes.slice(0, 12).map((periodo, index) => {
      const ingresosPorStream = {};
      let totalMes = 0;

      // Calcular cada fuente de ingresos
      Object.keys(revenueConfig.streams).forEach(streamKey => {
        const stream = revenueConfig.streams[streamKey];
        let ingresoStream = 0;

        switch (streamKey) {
          case 'cuota_mensual':
            ingresoStream = periodo.clientesActuales * (stream.precio_base || 0);
            break;
            
          case 'matricula':
            // Solo nuevos clientes pagan matrícula
            ingresoStream = periodo.clientesNuevos * (stream.precio || 0);
            break;
            
          case 'personal_training':
            // Asumimos que 25% de clientes toman PT
            const clientesPT = Math.round(periodo.clientesActuales * 0.25);
            const sesiones = clientesPT * (stream.sesiones_mes_promedio || 0);
            ingresoStream = sesiones * (stream.precio_sesion || 0);
            break;
            
          case 'llaves_tarjetas':
            // Solo nuevos clientes compran llaves
            ingresoStream = periodo.clientesNuevos * (stream.precio || 0);
            break;
            
          case 'tarifas_especiales':
            // Clientes con descuento (reducen ingresos)
            const clientesDescuento = Math.round(periodo.clientesActuales * 0.20);
            const descuentoTotal = clientesDescuento * (stream.precio_base || revenueConfig.streams.cuota_mensual?.precio_base || 0) * (stream.descuento || 0);
            ingresoStream = -descuentoTotal; // Negativo porque es descuento
            break;
            
          case 'ventas_comida':
            // Para restaurantes
            const comensalesDia = stream.comensales_dia || 45;
            const diasMes = 30;
            const ticketMedio = stream.ticket_medio_base || 25;
            ingresoStream = comensalesDia * diasMes * ticketMedio;
            break;
            
          case 'bebidas':
            // Porcentaje de ventas de comida
            const ventasComida = ingresosPorStream['ventas_comida'] || 0;
            ingresoStream = ventasComida * (stream.porcentaje_ventas_comida || 0.40);
            break;
            
          case 'menus_especiales':
            const eventosSemanales = stream.frecuencia_semanal || 2;
            const clientesPromedio = stream.clientes_promedio || 15;
            const precioPromedio = (stream.precio_rango ? (stream.precio_rango[0] + stream.precio_rango[1]) / 2 : 25);
            ingresoStream = eventosSemanales * 4 * clientesPromedio * precioPromedio;
            break;
            
          case 'catering':
            const eventosMes = stream.eventos_mes || 2;
            const precioEvento = stream.precio_promedio_evento || 800;
            ingresoStream = eventosMes * precioEvento;
            break;
            
          case 'ventas_productos':
            // Para e-commerce - basado en visitas
            const visitas = stream.visitas_base || 5000;
            const conversion = stream.conversion_rate_base || 0.025;
            const aov = stream.aov_base || 65;
            ingresoStream = visitas * conversion * aov;
            break;
            
          case 'envios':
            // E-commerce envíos
            const pedidos = Math.round((stream.visitas_base || 5000) * (stream.conversion_rate_base || 0.025));
            const pedidosConEnvio = pedidos * (stream.porcentaje_pedidos_cobrado || 0.70);
            ingresoStream = pedidosConEnvio * (stream.precio_envio || 4.95);
            break;
            
          case 'habitaciones':
            // Hoteles
            const habitaciones = stream.numero_habitaciones || 18;
            const ocupacion = 0.65; // Asumimos ocupación promedio
            const precioHabitacion = stream.precio_habitacion_base || 120;
            const estacionalidad = customerData.proyeccionClientes[index]?.factorEstacional || 1.0;
            ingresoStream = habitaciones * 30 * ocupacion * precioHabitacion * estacionalidad;
            break;
            
          default:
            // Streams personalizados
            if (stream.precio_base) {
              ingresoStream = periodo.clientesActuales * stream.precio_base;
            } else if (stream.precio_fijo) {
              ingresoStream = stream.precio_fijo;
            }
        }

        // Aplicar estacionalidad si corresponde
        if (streamKey !== 'tarifas_especiales' && periodo.factorEstacional && streamKey !== 'habitaciones') {
          ingresoStream *= periodo.factorEstacional;
        }

        ingresosPorStream[streamKey] = Math.round(ingresoStream);
        totalMes += ingresoStream;
      });

      // Streams personalizados
      revenueConfig.customStreams.forEach(customStream => {
        let ingresoCustom = 0;
        
        if (customStream.tipo === 'por_cliente') {
          ingresoCustom = periodo.clientesActuales * (customStream.precio || 0);
        } else if (customStream.tipo === 'fijo_mensual') {
          ingresoCustom = customStream.precio || 0;
        } else if (customStream.tipo === 'por_nuevo_cliente') {
          ingresoCustom = periodo.clientesNuevos * (customStream.precio || 0);
        }
        
        ingresosPorStream[customStream.id] = Math.round(ingresoCustom);
        totalMes += ingresoCustom;
      });

      return {
        mes: periodo.mes,
        mesNombre: periodo.mesNombre,
        clientesActuales: periodo.clientesActuales,
        clientesNuevos: periodo.clientesNuevos,
        ingresosPorStream,
        totalIngresos: Math.round(totalMes),
        factorEstacional: periodo.factorEstacional
      };
    });
  }, [customerData, revenueConfig]);

  // Métricas calculadas
  const metricas = useMemo(() => {
    const ingresosAno1 = proyeccionIngresos.reduce((sum, p) => sum + p.totalIngresos, 0);
    const promedioMensual = ingresosAno1 / 12;
    
    // Calcular distribución por stream
    const distribucionStreams = {};
    Object.keys(revenueConfig.streams).forEach(streamKey => {
      const totalStream = proyeccionIngresos.reduce((sum, p) => sum + (p.ingresosPorStream[streamKey] || 0), 0);
      distribucionStreams[streamKey] = {
        total: totalStream,
        porcentaje: ingresosAno1 > 0 ? (totalStream / ingresosAno1) * 100 : 0,
        promedio_mensual: totalStream / 12
      };
    });

    // Ingresos por cliente
    const clientesPromedio = customerData?.proyeccionClientes ? 
      customerData.proyeccionClientes.slice(0, 12).reduce((sum, p) => sum + p.clientesActuales, 0) / 12 : 1;
    
    const ingresosPorCliente = clientesPromedio > 0 ? promedioMensual / clientesPromedio : 0;

    return {
      ingresosAno1,
      promedioMensual,
      distribucionStreams,
      ingresosPorCliente,
      clientesPromedio
    };
  }, [proyeccionIngresos, revenueConfig, customerData]);

  // Datos para gráficos
  const distributionChartData = {
    labels: Object.keys(metricas.distribucionStreams).map(key => 
      revenueConfig.streams[key]?.descripcion || key.replace('_', ' ')
    ),
    datasets: [{
      data: Object.values(metricas.distribucionStreams).map(s => s.total),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const monthlyRevenueChart = {
    labels: proyeccionIngresos.map(p => p.mesNombre),
    datasets: [{
      label: 'Ingresos Totales',
      data: proyeccionIngresos.map(p => p.totalIngresos),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  };

  // Manejar cambios
  const handleStreamChange = (streamKey, field, value) => {
    const newStreams = {
      ...revenueConfig.streams,
      [streamKey]: {
        ...revenueConfig.streams[streamKey],
        [field]: value
      }
    };
    
    const newConfig = {
      ...revenueConfig,
      streams: newStreams
    };
    
    setRevenueConfig(newConfig);
    
    if (onRevenueDataChange) {
      onRevenueDataChange({
        revenueConfig: newConfig,
        proyeccionIngresos,
        metricas
      });
    }
  };

  const addCustomStream = () => {
    const newStream = {
      id: `custom_${Date.now()}`,
      nombre: 'Nueva fuente de ingresos',
      tipo: 'fijo_mensual',
      precio: 0,
      descripcion: ''
    };
    
    setRevenueConfig(prev => ({
      ...prev,
      customStreams: [...prev.customStreams, newStream]
    }));
  };

  const removeCustomStream = (streamId) => {
    setRevenueConfig(prev => ({
      ...prev,
      customStreams: prev.customStreams.filter(s => s.id !== streamId)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Múltiples Fuentes de Ingresos</h2>
        <p className="text-green-100">
          Gestión profesional de ingresos • {businessModel?.nombre || 'Modelo personalizado'}
        </p>
      </div>

      {/* Métricas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-600">Ingresos Año 1</h4>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(metricas.ingresosAno1)}</p>
          <p className="text-xs text-green-600">Total proyectado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600">Promedio Mensual</h4>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(metricas.promedioMensual)}</p>
          <p className="text-xs text-blue-600">Ingresos mensuales</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h4 className="text-sm font-medium text-gray-600">Ingreso por Cliente</h4>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(metricas.ingresosPorCliente)}</p>
          <p className="text-xs text-orange-600">ARPU promedio</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-600">Fuentes Activas</h4>
          <p className="text-2xl font-bold text-gray-900">
            {Object.keys(revenueConfig.streams).length + revenueConfig.customStreams.length}
          </p>
          <p className="text-xs text-purple-600">Streams configurados</p>
        </div>
      </div>

      {/* Configuración de streams principales */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración de Fuentes de Ingresos</h3>
        
        <div className="space-y-6">
          {Object.keys(revenueConfig.streams).map(streamKey => {
            const stream = revenueConfig.streams[streamKey];
            const distribucion = metricas.distribucionStreams[streamKey] || {};
            
            return (
              <div key={streamKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {stream.descripcion || streamKey.replace('_', ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm text-gray-600">{stream.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">
                      {formatCurrency(distribucion.total || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(distribucion.porcentaje || 0).toFixed(1)}% del total
                    </p>
                  </div>
                </div>

                {/* Configuración específica por tipo de stream */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {streamKey === 'cuota_mensual' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio Base (€)
                        </label>
                        <input
                          type="number"
                          value={stream.precio_base || 0}
                          onChange={(e) => handleStreamChange(streamKey, 'precio_base', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rango Mínimo (€)
                        </label>
                        <input
                          type="number"
                          value={stream.rango?.[0] || 0}
                          onChange={(e) => handleStreamChange(streamKey, 'rango', [parseFloat(e.target.value) || 0, stream.rango?.[1] || 0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rango Máximo (€)
                        </label>
                        <input
                          type="number"
                          value={stream.rango?.[1] || 0}
                          onChange={(e) => handleStreamChange(streamKey, 'rango', [stream.rango?.[0] || 0, parseFloat(e.target.value) || 0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </>
                  )}

                  {streamKey === 'matricula' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Precio Matrícula (€)
                      </label>
                      <input
                        type="number"
                        value={stream.precio || 0}
                        onChange={(e) => handleStreamChange(streamKey, 'precio', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}

                  {streamKey === 'personal_training' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio por Sesión (€)
                        </label>
                        <input
                          type="number"
                          value={stream.precio_sesion || 0}
                          onChange={(e) => handleStreamChange(streamKey, 'precio_sesion', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Sesiones/Mes Promedio
                        </label>
                        <input
                          type="number"
                          value={stream.sesiones_mes_promedio || 0}
                          onChange={(e) => handleStreamChange(streamKey, 'sesiones_mes_promedio', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Añadir más configuraciones según el tipo de stream */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streams personalizados */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Fuentes de Ingresos Personalizadas</h3>
          <button
            onClick={addCustomStream}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Añadir Fuente
          </button>
        </div>

        {revenueConfig.customStreams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay fuentes personalizadas. Añade una nueva fuente de ingresos específica para tu negocio.
          </p>
        ) : (
          <div className="space-y-4">
            {revenueConfig.customStreams.map(stream => (
              <div key={stream.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <input
                    type="text"
                    value={stream.nombre}
                    onChange={(e) => {
                      const newStreams = revenueConfig.customStreams.map(s =>
                        s.id === stream.id ? { ...s, nombre: e.target.value } : s
                      );
                      setRevenueConfig(prev => ({ ...prev, customStreams: newStreams }));
                    }}
                    className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={() => removeCustomStream(stream.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={stream.tipo}
                      onChange={(e) => {
                        const newStreams = revenueConfig.customStreams.map(s =>
                          s.id === stream.id ? { ...s, tipo: e.target.value } : s
                        );
                        setRevenueConfig(prev => ({ ...prev, customStreams: newStreams }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="fijo_mensual">Ingreso Fijo Mensual</option>
                      <option value="por_cliente">Por Cliente Activo</option>
                      <option value="por_nuevo_cliente">Por Nuevo Cliente</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Precio (€)</label>
                    <input
                      type="number"
                      value={stream.precio || 0}
                      onChange={(e) => {
                        const newStreams = revenueConfig.customStreams.map(s =>
                          s.id === stream.id ? { ...s, precio: parseFloat(e.target.value) || 0 } : s
                        );
                        setRevenueConfig(prev => ({ ...prev, customStreams: newStreams }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={stream.descripcion}
                      onChange={(e) => {
                        const newStreams = revenueConfig.customStreams.map(s =>
                          s.id === stream.id ? { ...s, descripcion: e.target.value } : s
                        );
                        setRevenueConfig(prev => ({ ...prev, customStreams: newStreams }));
                      }}
                      placeholder="Ej: Venta de productos, servicios adicionales..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de ingresos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Ingresos</h3>
          <div className="h-64 flex items-center justify-center">
            {Object.keys(metricas.distribucionStreams).length > 0 ? (
              <Doughnut
                data={distributionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  }
                }}
              />
            ) : (
              <p className="text-gray-500">Configure las fuentes de ingresos para ver la distribución</p>
            )}
          </div>
        </div>

        {/* Evolución mensual */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Ingresos Mensuales</h3>
          <div className="h-64">
            <Bar
              data={monthlyRevenueChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0
                        }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyección Detallada por Fuente</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clientes</th>
                {Object.keys(revenueConfig.streams).map(streamKey => (
                  <th key={streamKey} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {streamKey.replace('_', ' ')}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proyeccionIngresos.map((periodo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {periodo.mesNombre}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {periodo.clientesActuales.toLocaleString()}
                  </td>
                  {Object.keys(revenueConfig.streams).map(streamKey => (
                    <td key={streamKey} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(periodo.ingresosPorStream[streamKey] || 0)}
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(periodo.totalIngresos)}
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

export default MultipleRevenueStreams;