import { useState } from 'react';

const Sidebar = ({ activeSection, onSectionChange, professionalMode = false }) => {
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // Grupos de navegación organizados
  const navigationGroups = [
    {
      id: 'analysis',
      label: 'Análisis',
      sections: [
        { id: 'resumen', label: 'Resumen Ejecutivo' },
        { id: 'proyecciones', label: 'Proyecciones' },
        { id: 'sensibilidad', label: 'Análisis Sensibilidad' }
      ]
    },
    {
      id: 'configuration',
      label: 'Configuración',
      sections: [
        { id: 'supuestos', label: 'Supuestos Generales' },
        ...(professionalMode ? [
          { id: 'clientes', label: 'Gestión Clientes' },
          { id: 'ingresos', label: 'Fuentes Ingresos' },
          { id: 'gastos', label: 'Gastos Operacionales' }
        ] : [])
      ]
    },
    {
      id: 'kpis',
      label: 'KPIs',
      sections: [
        { id: 'ratios', label: 'Ratios Financieros' },
        ...(professionalMode ? [
          { id: 'kpis', label: 'KPIs Operacionales' }
        ] : [])
      ]
    },
    {
      id: 'banking',
      label: 'Bancario',
      sections: [
        { id: 'garantias', label: 'Garantías' },
        ...(professionalMode ? [
          { id: 'proyecciones-detalladas', label: 'Proyecciones Detalladas' }
        ] : [])
      ]
    }
  ];

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Plan Financiero</h2>
        {professionalMode && (
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            Modo Profesional
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationGroups.map((group) => (
          <div key={group.id} className="mb-4">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center justify-between"
            >
              {group.label}
              <span className={`transform transition-transform ${collapsedGroups[group.id] ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Group Sections */}
            {!collapsedGroups[group.id] && (
              <div className="mt-1">
                {group.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-full px-6 py-3 text-left text-sm font-medium transition-colors
                      ${activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>Versión 2.0</div>
          <div>Modo Profesional {professionalMode ? 'Activo' : 'Desactivado'}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;