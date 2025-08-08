const Proyecciones = ({ 
  calculatedResults, 
  formatCurrency 
}) => {
  // Mock data for testing
  const mockData = [
    { mes: 1, nuevos: 120, total: 120, ingresos: 8400, gastos: 26500, ebitda: -18100, cashflow: -18100 },
    { mes: 2, nuevos: 150, total: 266, ingresos: 18620, gastos: 27500, ebitda: -8880, cashflow: -26980 },
    { mes: 3, nuevos: 180, total: 436, ingresos: 30520, gastos: 28500, ebitda: 2020, cashflow: -24960 },
    { mes: 4, nuevos: 200, total: 622, ingresos: 43540, gastos: 29500, ebitda: 14040, cashflow: -10920 },
    { mes: 5, nuevos: 220, total: 824, ingresos: 57680, gastos: 30500, ebitda: 27180, cashflow: 16260 },
    { mes: 6, nuevos: 250, total: 1047, ingresos: 73290, gastos: 32000, ebitda: 41290, cashflow: 57550 },
    { mes: 7, nuevos: 280, total: 1291, ingresos: 90370, gastos: 33500, ebitda: 56870, cashflow: 114420 },
    { mes: 8, nuevos: 300, total: 1550, ingresos: 108500, gastos: 35000, ebitda: 73500, cashflow: 187920 },
    { mes: 9, nuevos: 320, total: 1824, ingresos: 127680, gastos: 36500, ebitda: 91180, cashflow: 279100 },
    { mes: 10, nuevos: 340, total: 2111, ingresos: 147770, gastos: 38000, ebitda: 109770, cashflow: 388870 },
    { mes: 11, nuevos: 360, total: 2410, ingresos: 168700, gastos: 39500, ebitda: 129200, cashflow: 518070 },
    { mes: 12, nuevos: 380, total: 2720, ingresos: 190400, gastos: 41000, ebitda: 149400, cashflow: 667470 }
  ];

  return (
    <div className="space-y-8">
      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Proyecciones Mensuales - Año 1</h3>
        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-gray-600">Gráfico de Proyecciones</div>
            <div className="text-sm text-gray-500 mt-1">(Chart.js se cargará aquí)</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalle Mensual</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nuevos Socios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Socios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gastos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EBITDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cash Flow Acum.
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((row) => (
                <tr key={row.mes} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Mes {row.mes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.nuevos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.ingresos)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(row.gastos)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${row.ebitda >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(row.ebitda)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${row.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(row.cashflow)}
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

export default Proyecciones;