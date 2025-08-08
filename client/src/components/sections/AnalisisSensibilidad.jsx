const AnalisisSensibilidad = ({ 
  financialData, 
  formatCurrency, 
  formatPercentage 
}) => {
  // Mock sensitivity data
  const scenarios = [
    {
      name: 'Escenario Pesimista',
      cuotaMensual: 60,
      sociosAno1: 2200,
      tirProyecto: 28.2,
      vanProyecto: 950000,
      color: 'red'
    },
    {
      name: 'Escenario Base',
      cuotaMensual: 70,
      sociosAno1: 2720,
      tirProyecto: 38.5,
      vanProyecto: 1250000,
      color: 'blue'
    },
    {
      name: 'Escenario Optimista',
      cuotaMensual: 80,
      sociosAno1: 3200,
      tirProyecto: 48.8,
      vanProyecto: 1550000,
      color: 'green'
    }
  ];

  const sensitivityMetrics = [
    { metric: 'Cuota Mensual', impact: 'Alto', sensitivity: '±15%' },
    { metric: 'Tasa de Bajas', impact: 'Medio', sensitivity: '±25%' },
    { metric: 'Costes Fijos', impact: 'Medio', sensitivity: '±10%' },
    { metric: 'CAC', impact: 'Bajo', sensitivity: '±20%' }
  ];

  return (
    <div className="space-y-8">
      {/* Scenarios Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis de Escenarios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escenario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuota Mensual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Socios Año 1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TIR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VAN
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scenarios.map((scenario, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scenario.color === 'red' ? 'bg-red-100 text-red-800' :
                      scenario.color === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {scenario.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(scenario.cuotaMensual)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {scenario.sociosAno1.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPercentage(scenario.tirProyecto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(scenario.vanProyecto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis de Sensibilidad Visual</h3>
        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-gray-600">Gráfico de Sensibilidad</div>
            <div className="text-sm text-gray-500 mt-1">(Tornado Chart se cargará aquí)</div>
          </div>
        </div>
      </div>

      {/* Sensitivity Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Variables Críticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sensitivityMetrics.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{item.metric}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                  item.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.impact}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Sensibilidad: {item.sensitivity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monte Carlo Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Simulación Monte Carlo</h3>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl mb-2">🎲</div>
            <div className="font-medium text-gray-900 mb-2">10,000 Simulaciones</div>
            <div className="text-sm text-gray-600">
              Probabilidad de TIR > 15%: <strong>89.3%</strong>
            </div>
            <div className="text-sm text-gray-600">
              Probabilidad de VAN > 0: <strong>94.7%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisSensibilidad;