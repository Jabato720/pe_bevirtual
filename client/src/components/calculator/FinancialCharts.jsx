import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const FinancialCharts = ({ clients, pl, cashflow, formatCurrency }) => {
  // Si no hay datos, mostrar estado de carga
  if (!clients || clients.length === 0 || !pl || !cashflow) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            📈 Análisis Gráfico Financiero
          </span>
        </h2>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-color"></div>
        </div>
      </div>
    );
  }

  // Preparar datos para los gráficos
  const chartData = clients.map((client, index) => ({
    mes: `Mes ${client.mes}`,
    mesNumerico: client.mes,
    sociosInicio: client.sociosInicio,
    sociosNuevos: client.sociosNuevos,
    sociosPerdidos: client.sociosPerdidos,
    sociosTotales: client.sociosTotales,
    sociosNetos: client.sociosNetos,
    ingresosNetos: pl.totalIngresosNeto ? pl.totalIngresosNeto[index] : 0,
    gastos: pl.totalGastos ? pl.totalGastos[index] : 0,
    ebitda: pl.ebitda ? pl.ebitda[index] : 0,
    flujoNeto: cashflow.neto ? cashflow.neto[index] : 0,
    flujoAcumulado: cashflow.acumulado ? cashflow.acumulado[index] : 0,
    perdidaMorosidad: pl.perdidaMorosidad ? pl.perdidaMorosidad[index] : 0
  }));

  // Colores para los gráficos
  const colors = {
    positive: '#16a34a',
    negative: '#dc2626',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    info: '#06b6d4'
  };

  // Datos para el gráfico de distribución de ingresos vs gastos
  const incomeExpenseData = chartData.map(item => ({
    ...item,
    gastosPositivos: Math.abs(item.gastos)
  }));

  // Datos para el gráfico de pie de la composición promedio
  const avgIncome = chartData.reduce((sum, item) => sum + item.ingresosNetos, 0) / chartData.length;
  const avgExpenses = chartData.reduce((sum, item) => sum + Math.abs(item.gastos), 0) / chartData.length;
  const avgMorosidad = chartData.reduce((sum, item) => sum + item.perdidaMorosidad, 0) / chartData.length;

  const pieData = [
    { name: 'Ingresos Netos', value: avgIncome, color: colors.positive },
    { name: 'Gastos Operativos', value: avgExpenses, color: colors.negative },
    { name: 'Pérdida Morosidad', value: avgMorosidad, color: colors.accent }
  ];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          📈 Análisis Gráfico Financiero
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolución de Socios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            👥 Evolución de Socios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="sociosTotales"
                fill={colors.primary}
                stroke={colors.primary}
                fillOpacity={0.3}
                name="Socios Totales"
              />
              <Bar dataKey="sociosNuevos" fill={colors.positive} name="Nuevos Socios" />
              <Bar dataKey="sociosPerdidos" fill={colors.negative} name="Bajas" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Flujo de Caja */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            💰 Flujo de Caja
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="flujoNeto" fill={colors.info} name="Flujo Neto" />
              <Line
                type="monotone"
                dataKey="flujoAcumulado"
                stroke={colors.secondary}
                strokeWidth={3}
                name="Flujo Acumulado"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Ingresos vs Gastos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            💵 Ingresos vs Gastos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ingresosNetos" fill={colors.positive} name="Ingresos Netos" />
              <Bar dataKey="gastosPositivos" fill={colors.negative} name="Gastos Totales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de EBITDA */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            📈 Evolución EBITDA
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="ebitda"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
                name="EBITDA"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pie - Distribución Promedio */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          🥧 Distribución Promedio Mensual
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [formatCurrency(value), '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialCharts;