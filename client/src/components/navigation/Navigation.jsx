import { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Target, 
  Building2, 
  Calculator,
  Users,
  DollarSign,
  FileText,
  Activity,
  Table
} from 'lucide-react';

const Navigation = ({ activeSection, onSectionChange, professionalMode = false }) => {
  // Pestañas tradicionales (siempre disponibles)
  const traditionalSections = [
    { 
      id: 'resumen', 
      label: 'Resumen Ejecutivo',
      Icon: BarChart3
    },
    { 
      id: 'supuestos', 
      label: 'Supuestos Generales',
      Icon: Settings
    },
    { 
      id: 'proyecciones', 
      label: 'Proyecciones',
      Icon: TrendingUp
    },
    { 
      id: 'sensibilidad', 
      label: 'Análisis Sensibilidad',
      Icon: Target
    },
    { 
      id: 'garantias', 
      label: 'Garantías',
      Icon: Building2
    },
    { 
      id: 'ratios', 
      label: 'Ratios Financieros',
      Icon: Calculator
    }
  ];

  // Pestañas profesionales (solo en modo profesional)
  const professionalSections = [
    { 
      id: 'clientes', 
      label: 'Gestión Clientes',
      Icon: Users,
      professional: true,
      description: 'Altas/bajas mensuales'
    },
    { 
      id: 'ingresos', 
      label: 'Fuentes Ingresos',
      Icon: DollarSign,
      professional: true,
      description: 'Múltiples streams'
    },
    { 
      id: 'gastos', 
      label: 'Gastos Operacionales',
      Icon: FileText,
      professional: true,
      description: 'Costes fijos/variables'
    },
    { 
      id: 'kpis', 
      label: 'KPIs Operacionales',
      Icon: Activity,
      professional: true,
      description: 'Benchmarking sector'
    },
    { 
      id: 'proyecciones-detalladas', 
      label: 'Proyecciones Detalladas',
      Icon: Table,
      professional: true,
      description: 'Tabla estilo Excel'
    }
  ];

  // Combinar secciones según el modo
  const sections = professionalMode 
    ? [...traditionalSections, ...professionalSections]
    : traditionalSections;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
      <div className="px-8">
        <nav className="flex space-x-6 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap
                transition-colors duration-200 group
                ${activeSection === section.id
                  ? (section.professional 
                      ? 'border-blue-600 text-blue-700' 
                      : 'border-gray-900 text-gray-900')
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <section.Icon 
                className={`w-5 h-5 ${section.professional ? 'group-hover:scale-110 transition-transform' : ''}`}
              />
              <div className="flex flex-col items-start">
                <span>{section.label}</span>
                {section.professional && (
                  <span className="text-xs text-blue-600 opacity-75">
                    {section.description}
                  </span>
                )}
              </div>
              {section.professional && (
                <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium ml-1">
                  PRO
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;