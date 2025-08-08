import React, { useState, useMemo } from 'react';
import { businessModels, getAllSectors, getAllCategories, getCategoryLabel, formatCurrency } from '../data/businessModels';

const BusinessModelSelector = ({ onModelSelect, onBack }) => {
  const [selectedSector, setSelectedSector] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);

  // Obtener datos para filtros
  const sectores = getAllSectors();
  const categorias = getAllCategories();

  // Filtrar modelos
  const filteredModels = useMemo(() => {
    return Object.values(businessModels).filter(model => {
      const sectorMatch = selectedSector === 'todos' || model.sector === selectedSector;
      const categoryMatch = selectedCategory === 'todos' || model.categoria_inversion === selectedCategory;
      const searchMatch = searchTerm === '' || 
        model.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return sectorMatch && categoryMatch && searchMatch;
    });
  }, [selectedSector, selectedCategory, searchTerm]);

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };

  const handleContinue = () => {
    if (selectedModel) {
      onModelSelect(selectedModel);
    }
  };

  const getCategoryBadgeColor = (categoria) => {
    const colors = {
      'muy-baja': 'bg-green-100 text-green-800 border-green-200',
      'baja': 'bg-blue-100 text-blue-800 border-blue-200',
      'media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'alta': 'bg-orange-100 text-orange-800 border-orange-200',
      'muy-alta': 'bg-red-100 text-red-800 border-red-200',
      'personalizada': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSectorIcon = (sector) => {
    const icons = {
      'Digital/E-commerce': '🛒',
      'Digital/Retail': '🌐',
      'Servicios B2B': '💼',
      'Tecnología/Software': '💻',
      'Restauración': '🍽️',
      'Deporte/Fitness': '💪',
      'Retail/Comercio': '🏪',
      'Franquicias': '🏢',
      'Sanidad': '🏥',
      'Turismo/Hostelería': '🏨',
      'Personalizado': '⚙️'
    };
    return icons[sector] || '🏛️';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Selecciona tu Modelo de Negocio
              </h1>
              <p className="text-gray-600 mt-1">
                Elige entre {Object.keys(businessModels).length} modelos profesionales o crea uno personalizado
              </p>
            </div>
            
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Volver
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar modelo
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los sectores</option>
                {sectores.map(sector => (
                  <option key={sector} value={sector}>
                    {getSectorIcon(sector)} {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por inversión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Inversión
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los rangos</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {getCategoryLabel(categoria)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Mostrando {filteredModels.length} de {Object.keys(businessModels).length} modelos
            </span>
            {selectedModel && (
              <span className="text-blue-600 font-medium">
                ✓ {selectedModel.nombre} seleccionado
              </span>
            )}
          </div>
        </div>

        {/* Grid de modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredModels.map(model => (
            <div
              key={model.id}
              onClick={() => handleModelClick(model)}
              className={`bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedModel?.id === model.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getSectorIcon(model.sector)}</span>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {model.nombre}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">{model.sector}</p>
                </div>
                
                {selectedModel?.id === model.id && (
                  <div className="ml-2 text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Badge de categoría */}
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${getCategoryBadgeColor(model.categoria_inversion)}`}>
                {getCategoryLabel(model.categoria_inversion)}
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {model.description}
              </p>

              {/* Rango de inversión */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Inversión requerida:</p>
                {model.id === 'generico' ? (
                  <p className="text-lg font-bold text-gray-900">Personalizable</p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(model.inversion_min)} - {formatCurrency(model.inversion_max)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Promedio: {formatCurrency(model.inversion_promedio)}
                    </p>
                  </>
                )}
              </div>

              {/* Métricas clave */}
              {model.metricas_sector && !model.metricas_sector.personalizable && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">MÉTRICAS CLAVE:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Margen bruto:</span>
                      <span className="font-medium ml-1 text-green-600">
                        {Math.round(model.metricas_sector.margen_bruto_promedio * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Equilibrio:</span>
                      <span className="font-medium ml-1 text-blue-600">
                        {model.metricas_sector.punto_equilibrio_meses} meses
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Items incluidos */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  {model.id === 'generico' ? 'TOTALMENTE PERSONALIZABLE' : `INCLUYE ${model.items_obligatorios.length} ELEMENTOS:`}
                </p>
                {model.id === 'generico' ? (
                  <p className="text-xs text-gray-600">
                    Crea tu plan desde cero con total flexibilidad
                  </p>
                ) : (
                  <div className="text-xs text-gray-600">
                    {model.items_obligatorios.slice(0, 4).map(item => item.nombre).join(', ')}
                    {model.items_obligatorios.length > 4 && '...'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No hay resultados */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.062M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 106.343 6.343z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron modelos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o utiliza el modelo genérico para crear uno personalizado
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSector('todos');
                setSelectedCategory('todos');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Botón continuar */}
        {selectedModel && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">
                  {selectedModel.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedModel.id === 'generico' ? 'Plan personalizable' : formatCurrency(selectedModel.inversion_promedio) + ' inversión promedio'}
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Continuar con este modelo →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessModelSelector;