const Garantias = ({ 
  financialData, 
  formatCurrency 
}) => {
  const guarantees = [
    {
      type: 'Personal',
      description: 'Aval Personal Solidario',
      value: financialData.inversion * 0.5,
      status: 'Confirmado',
      details: 'Garantía personal de los socios promotores'
    },
    {
      type: 'Real',
      description: 'Hipoteca sobre Local Comercial',
      value: 750000,
      status: 'Pendiente Tasación',
      details: 'Local comercial 400m² en zona premium'
    },
    {
      type: 'Bancaria',
      description: 'Póliza de Crédito',
      value: 100000,
      status: 'Aprobada',
      details: 'Línea de crédito para capital de trabajo'
    }
  ];

  const insurancePolicies = [
    {
      name: 'Seguro de Responsabilidad Civil',
      coverage: '2.000.000€',
      premium: '2.400€/año',
      status: 'Vigente'
    },
    {
      name: 'Seguro de Actividad',
      coverage: '500.000€',
      premium: '1.800€/año',
      status: 'Vigente'
    },
    {
      name: 'Seguro de Incendios',
      coverage: '1.500.000€',
      premium: '3.200€/año',
      status: 'Vigente'
    }
  ];

  const totalGuaranteeValue = guarantees.reduce((sum, g) => sum + g.value, 0);
  const guaranteeCoverage = (totalGuaranteeValue / financialData.inversion) * 100;

  return (
    <div className="space-y-8">
      {/* Guarantee Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen de Garantías</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalGuaranteeValue)}</div>
            <div className="text-blue-700 font-medium">Valor Total Garantías</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-900">{guaranteeCoverage.toFixed(0)}%</div>
            <div className="text-green-700 font-medium">Cobertura sobre Préstamo</div>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">AAA</div>
            <div className="text-purple-700 font-medium">Rating de Garantías</div>
          </div>
        </div>
      </div>

      {/* Guarantees Detail */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detalle de Garantías</h3>
        <div className="space-y-4">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{guarantee.description}</h4>
                  <p className="text-sm text-gray-600">{guarantee.details}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(guarantee.value)}</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    guarantee.status === 'Confirmado' || guarantee.status === 'Aprobada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {guarantee.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  guarantee.type === 'Personal' ? 'bg-blue-100 text-blue-800' :
                  guarantee.type === 'Real' ? 'bg-orange-100 text-orange-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  Garantía {guarantee.type}
                </span>
                <div className="text-sm text-gray-500">
                  {((guarantee.value / financialData.inversion) * 100).toFixed(1)}% del préstamo
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Coverage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cobertura de Seguros</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Seguro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cobertura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prima Anual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurancePolicies.map((policy, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {policy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.coverage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {policy.premium}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal Structure */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Estructura Legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Información Societaria</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Forma Jurídica:</span>
                <span className="font-medium">S.L.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capital Social:</span>
                <span className="font-medium">150.000€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registro Mercantil:</span>
                <span className="font-medium">Tomo 1234, Folio 567</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Documentación</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <span>Escritura de Constitución</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <span>Estatutos Sociales</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <span>Poder de Representación</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                <span>Licencia de Actividad (Tramitando)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Garantias;