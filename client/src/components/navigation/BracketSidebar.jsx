import React, { useState } from 'react';
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
  Table,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const BracketSidebar = ({ activeSection, onSectionChange, professionalMode = false }) => {
  const [expandedGroups, setExpandedGroups] = useState({
    analysis: true,
    configuration: true,
    professional: true,
    banking: true
  });

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const navigationGroups = [
    {
      id: 'analysis',
      label: 'Análisis Principal',
      sections: [
        { id: 'resumen', label: 'Resumen Ejecutivo', icon: BarChart3 },
        { id: 'proyecciones', label: 'Proyecciones', icon: TrendingUp },
        { id: 'sensibilidad', label: 'Análisis Sensibilidad', icon: Target }
      ]
    },
    {
      id: 'configuration',
      label: 'Configuración Base',
      sections: [
        { id: 'supuestos', label: 'Supuestos Generales', icon: Settings }
      ]
    },
    {
      id: 'professional',
      label: 'Gestión Profesional',
      show: professionalMode,
      sections: [
        { id: 'clientes', label: 'Gestión Clientes', icon: Users, description: 'Altas/bajas mensuales' },
        { id: 'ingresos', label: 'Fuentes Ingresos', icon: DollarSign, description: 'Múltiples streams' },
        { id: 'gastos', label: 'Gastos Operacionales', icon: FileText, description: 'Costes fijos/variables' },
        { id: 'kpis', label: 'KPIs Operacionales', icon: Activity, description: 'Benchmarking sector' }
      ]
    },
    {
      id: 'banking',
      label: 'Información Bancaria',
      sections: [
        { id: 'ratios', label: 'Ratios Financieros', icon: Calculator },
        { id: 'garantias', label: 'Garantías', icon: Building2 },
        ...(professionalMode ? [
          { id: 'proyecciones-detalladas', label: 'Proyecciones Detalladas', icon: Table, description: 'Tabla estilo Excel' }
        ] : [])
      ]
    }
  ];

  return (
    <div className="br-sidebar">
      {/* Logo */}
      <div className="br-logo">
        <a href="#">
          <span>[</span>financial <i>pro</i><span>]</span>
        </a>
      </div>

      {/* Navigation */}
      <div className="br-nav">
        {navigationGroups.map((group) => {
          if (group.show === false) return null;
          
          const isExpanded = expandedGroups[group.id];
          const Icon = isExpanded ? ChevronDown : ChevronRight;
          
          return (
            <div key={group.id}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="br-nav-label d-flex align-items-center justify-content-between w-100 border-0 bg-transparent"
                style={{ cursor: 'pointer' }}
              >
                {group.label}
                <Icon className="w-3 h-3" />
              </button>

              {/* Group Items */}
              {isExpanded && (
                <div className="br-nav-group">
                  {group.sections.map((section) => {
                    const SectionIcon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <div key={section.id} className="br-nav-item">
                        <button
                          onClick={() => onSectionChange(section.id)}
                          className={`br-nav-link w-100 border-0 bg-transparent text-start ${
                            isActive ? 'active' : ''
                          }`}
                        >
                          <SectionIcon className="br-nav-icon" />
                          <div className="flex-1">
                            <div className="tx-13 tx-medium">{section.label}</div>
                            {section.description && (
                              <div className="tx-11 tx-muted" style={{ marginTop: '2px' }}>
                                {section.description}
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Professional Mode Badge */}
      {professionalMode && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--sidebar-border)', marginTop: 'auto' }}>
          <div className="bg-light-primary rounded" style={{ padding: '0.75rem', textAlign: 'center' }}>
            <div className="tx-12 tx-primary tx-bold">MODO PROFESIONAL</div>
            <div className="tx-11 tx-muted">Funciones avanzadas activas</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketSidebar;