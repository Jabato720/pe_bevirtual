const SupuestosGenerales = ({ 
  financialData, 
  setFinancialData, 
  fixedCosts, 
  setFixedCosts,
  formatCurrency 
}) => {
  const handleInputChange = (field, value) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-8">
      {/* Investment Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Parámetros de Inversión</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inversión Inicial (€)
            </label>
            <input 
              type="number" 
              value={financialData.inversion}
              onChange={(e) => handleInputChange('inversion', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuota Mensual / Socio (€)
            </label>
            <input 
              type="number" 
              value={financialData.cuotaMensual}
              onChange={(e) => handleInputChange('cuotaMensual', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingreso Personal Training (€/mes)
            </label>
            <input 
              type="number" 
              value={financialData.ingresoPT}
              onChange={(e) => handleInputChange('ingresoPT', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuota Inscripción / Nuevo Socio (€)
            </label>
            <input 
              type="number" 
              value={financialData.cuotaInscripcion}
              onChange={(e) => handleInputChange('cuotaInscripcion', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cost Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Supuestos de Costes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasa de Bajas Mensual (%)
            </label>
            <input 
              type="number" 
              value={financialData.churnRate}
              onChange={(e) => handleInputChange('churnRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coste Variable / Socio (€)
            </label>
            <input 
              type="number" 
              value={financialData.costeVariable}
              onChange={(e) => handleInputChange('costeVariable', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coste Adquisición Cliente (€)
            </label>
            <input 
              type="number" 
              value={financialData.cac}
              onChange={(e) => handleInputChange('cac', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasa de Morosos (%)
            </label>
            <input 
              type="number" 
              value={financialData.tasaMorosos}
              onChange={(e) => handleInputChange('tasaMorosos', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Recalcular Proyecciones
        </button>
      </div>
    </div>
  );
};

export default SupuestosGenerales;