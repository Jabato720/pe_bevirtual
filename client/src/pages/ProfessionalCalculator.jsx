import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Activity, FileText, BarChart } from 'lucide-react';

// Import Bracket Dashboard styles (just the CSS)
import '../styles/bracket-dashboard.css';

// Components
import Header from '../components/navigation/Header';
import Navigation from '../components/navigation/Navigation';
import MetricCard from '../components/metrics/MetricCard';
import StatusBadge from '../components/metrics/StatusBadge';
import Alert from '../components/alerts/Alert';

// Sections
import ResumenExecutivo from '../components/sections/ResumenExecutivo';
import SupuestosGenerales from '../components/sections/SupuestosGenerales';
import Proyecciones from '../components/sections/Proyecciones';
import AnalisisSensibilidad from '../components/sections/AnalisisSensibilidad';
import Garantias from '../components/sections/Garantias';
import RatiosFinancieros from '../components/sections/RatiosFinancieros';

// Professional Components
import CustomerManagementSystem from '../components/CustomerManagement/CustomerManagementSystem';
import MultipleRevenueStreams from '../components/Revenue/MultipleRevenueStreams';
import OperationalCosts from '../components/Costs/OperationalCosts';
import OperationalKPIs from '../components/Analytics/OperationalKPIs';
import DetailedMonthlyProjections from '../components/Projections/DetailedMonthlyProjections';

// Business Models
import { businessModelsProfessional } from '../data/businessModelsProfessional';
import { createProfessionalCalculator } from '../utils/FinancialCalculatorProfessional';

const ProfessionalCalculator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // State Management
  const [activeSection, setActiveSection] = useState('resumen');
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [planName, setPlanName] = useState('Nuevo Plan Financiero');
  const [planDescription, setPlanDescription] = useState('');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState(null);
  
  // Bracket Dashboard state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Professional Data State
  const [customerData, setCustomerData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [costsData, setCostsData] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [professionalResults, setProfessionalResults] = useState(null);

  // Financial Data
  const [financialData, setFinancialData] = useState({
    // Basic Parameters
    inversion: 500000,
    cuotaMensual: 70,
    ingresoPT: 0,
    cuotaInscripcion: 0,
    churnRate: 5,
    costeVariable: 15,
    costeLlave: 0,
    tasaMorosos: 0,
    cac: 50,
    
    // Advanced Metrics
    tirObjetivo: 15.0,
    vanEsperado: 0,
    paybackMeses: 24,
    margenEbitda: 25.0,
    
    // Loan Details
    prestamoPrincipal: 0,
    prestamoInteres: 0,
    prestamoPlazoMeses: 84,
    
    // Market Data
    mercadoTam: 0,
    mercadoSam: 0,
    mercadoSom: 0,
    competenciaPrecioMedio: 65
  });

  const [fixedCosts, setFixedCosts] = useState([
    { id: 'alquiler', label: 'Alquiler del Local', value: 5000, category: 'operational', isConfirmed: true },
    { id: 'personal', label: 'Salarios Inc. SS.SS', value: 13750, category: 'personal', isConfirmed: true },
    { id: 'suministros', label: 'Suministros (Luz, Agua, Internet)', value: 2000, category: 'operational', isConfirmed: false },
    { id: 'leasing', label: 'Leasing Material Fitness', value: 0, category: 'equipment', isConfirmed: true },
    { id: 'marketing', label: 'Marketing y Publicidad', value: 2000, category: 'marketing', isConfirmed: true },
    { id: 'seguros', label: 'Seguros y Licencias', value: 800, category: 'legal', isConfirmed: true },
    { id: 'mantenimiento', label: 'Mantenimiento y Limpieza', value: 1200, category: 'operational', isConfirmed: false },
    { id: 'otros', label: 'Otros Gastos', value: 250, category: 'other', isConfirmed: false }
  ]);

  // Calculated Results (Legacy + Professional)
  const [calculatedResults, setCalculatedResults] = useState({
    totalCostesFijos: 0,
    breakEvenMes: null,
    breakEvenSocios: 0,
    sociosAno1: 0,
    ingresosAno1: 0,
    ebitdaAno1: 0,
    ebitdaAno1Percent: 0,
    tirProyecto: 0,
    vanProyecto: 0,
    paybackReal: 0,
    dscr: 0,
    monthlyProjections: []
  });

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage helper
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate Professional Financials
  const calculateProfessionalFinancials = () => {
    // Solo calcular si tenemos datos operacionales completos
    if (!customerData || !revenueData || !costsData || !selectedBusinessModel) {
      return;
    }

    try {
      const calculator = createProfessionalCalculator(selectedBusinessModel);
      
      const inputs = {
        customerData,
        revenueConfig: revenueData,
        costsConfig: costsData,
        fixedCosts,
        financialParams: {
          inversionInicial: financialData.inversion,
          prestamoPrincipal: financialData.prestamoPrincipal,
          prestamoInteres: financialData.prestamoInteres / 100,
          prestamoPlazoMeses: financialData.prestamoPlazoMeses,
          cuotaMensualPrestamo: calculateLoanPayment()
        }
      };

      const results = calculator.calculateProfessionalPlan(inputs);
      setProfessionalResults(results);
      
      // Actualizar también los resultados legacy para compatibilidad
      updateLegacyResults(results);
      
    } catch (error) {
      console.error('Error en cálculo profesional:', error);
      setError('Error en el cálculo profesional: ' + error.message);
    }
  };
  
  // Calculate legacy financials (fallback)
  const calculateFinancials = () => {
    const totalCosteFijo = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
    
    // Si tenemos resultados profesionales, usarlos
    if (professionalResults) {
      return;
    }
    
    // Basic calculations
    const contribucionMargen = financialData.cuotaMensual - financialData.costeVariable;
    const breakEvenSocios = Math.ceil(totalCosteFijo / contribucionMargen);
    
    // Mock advanced calculations (in production, this would be more complex)
    const sociosAno1 = 2720; // From your HTML example
    const ingresosAno1 = sociosAno1 * financialData.cuotaMensual * 12;
    const ebitdaAno1 = ingresosAno1 - (totalCosteFijo * 12) - (sociosAno1 * financialData.costeVariable * 12);
    const ebitdaAno1Percent = (ebitdaAno1 / ingresosAno1) * 100;
    
    // Advanced metrics
    const tirProyecto = 38.5; // Mock data
    const vanProyecto = 1250000; // Mock data
    const paybackReal = 24; // Mock data
    const dscr = 8.3; // Mock data

    setCalculatedResults({
      totalCostesFijos: totalCosteFijo,
      breakEvenMes: 3,
      breakEvenSocios,
      sociosAno1,
      ingresosAno1,
      ebitdaAno1,
      ebitdaAno1Percent,
      tirProyecto,
      vanProyecto,
      paybackReal,
      dscr,
      monthlyProjections: generateMonthlyProjections()
    });
  };
  
  // Update legacy results from professional calculation
  const updateLegacyResults = (professionalResults) => {
    if (!professionalResults.financialMetrics) return;
    
    const fm = professionalResults.financialMetrics;
    const cm = professionalResults.customerMetrics;
    
    setCalculatedResults(prev => ({
      ...prev,
      totalCostesFijos: fixedCosts.reduce((sum, cost) => sum + cost.value, 0),
      breakEvenMes: fm.breakEvenMes,
      breakEvenSocios: fm.breakEvenClientes,
      sociosAno1: cm.clientesFinAno1,
      ingresosAno1: fm.ingresosAno1,
      ebitdaAno1: fm.ebitdaAno1,
      ebitdaAno1Percent: fm.margenEbitdaAno1,
      tirProyecto: fm.tir,
      vanProyecto: fm.van,
      paybackReal: fm.paybackMeses,
      dscr: professionalResults.bankingRatios?.dscr || 0,
      monthlyProjections: professionalResults.monthlyProjections || []
    }));
  };
  
  // Calculate loan payment
  const calculateLoanPayment = () => {
    if (!financialData.prestamoPrincipal || !financialData.prestamoInteres || !financialData.prestamoPlazoMeses) {
      return 0;
    }
    
    const principal = financialData.prestamoPrincipal;
    const monthlyRate = (financialData.prestamoInteres / 100) / 12;
    const numPayments = financialData.prestamoPlazoMeses;
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  // Generate monthly projections
  const generateMonthlyProjections = () => {
    // Mock data generation - in production this would be based on actual business logic
    const projections = [];
    let totalSocios = 0;
    
    for (let month = 1; month <= 12; month++) {
      const nuevosSecretsrvicios = month <= 3 ? 120 + (month * 30) : Math.max(200 - (month * 5), 50);
      const sociosPerdidos = month > 1 ? Math.round(totalSocios * (financialData.churnRate / 100)) : 0;
      totalSocios = totalSocios - sociosPerdidos + nuevosSecretsrvicios;
      
      const ingresos = totalSocios * financialData.cuotaMensual + financialData.ingresoPT;
      const gastos = calculatedResults.totalCostesFijos + (totalSocios * financialData.costeVariable);
      const ebitda = ingresos - gastos;
      
      projections.push({
        month,
        nuevosSecretsrvicios,
        totalSocios,
        ingresos,
        gastos,
        ebitda,
        cashFlowAcumulado: month === 1 ? ebitda : projections[month - 2].cashFlowAcumulado + ebitda
      });
    }
    
    return projections;
  };

  // Save plan
  const savePlan = async () => {
    if (!planName.trim()) {
      setError('Por favor, introduce un nombre para el plan');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const planData = {
        name: planName,
        description: planDescription,
        financial_data: financialData,
        fixed_costs: fixedCosts,
        calculated_results: calculatedResults
      };

      if (id) {
        await axios.put(`/api/plan/${id}`, planData);
      } else {
        await axios.post('/api/plan', planData);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Error al guardar el plan');
    } finally {
      setSaving(false);
    }
  };

  // Load business model and plan
  useEffect(() => {
    // Cargar modelo de negocio seleccionado
    const savedModel = localStorage.getItem('selectedBusinessModel');
    if (savedModel) {
      const model = JSON.parse(savedModel);
      setSelectedBusinessModel(model);
      
      // Precargar datos si es un nuevo plan
      if (!id && model.id !== 'generico') {
        // Calcular inversión inicial basada en los items del modelo
        const inversionInicial = model.items_obligatorios?.reduce((sum, item) => sum + item.precio_estimado, 0) || model.inversion_promedio;
        
        // Actualizar nombre del plan
        setPlanName(`Plan ${model.nombre}`);
        setPlanDescription(`Plan financiero para ${model.nombre} - ${model.sector}`);
        
        // Precargar datos financieros
        setFinancialData(prev => ({
          ...prev,
          inversion: inversionInicial,
          // Usar datos operacionales del modelo profesional
          ...(model.revenue_streams?.cuota_mensual && {
            cuotaMensual: model.revenue_streams.cuota_mensual.precio_base
          }),
          ...(model.customer_management?.tasa_abandono_mensual && {
            churnRate: model.customer_management.tasa_abandono_mensual * 100
          }),
          // Usar métricas del sector si están disponibles
          ...(model.operational_kpis?.margen_ebitda && {
            margenEbitda: model.operational_kpis.margen_ebitda.target * 100
          })
        }));
        
        // Precargar costes fijos basados en gastos mensuales del modelo
        const costesFromModel = [];
        if (model.gastos_mensuales_detallados) {
          Object.entries(model.gastos_mensuales_detallados).forEach(([key, value]) => {
            if (typeof value === 'number') {
              costesFromModel.push({
                id: key,
                label: key.replace('_', ' ').toUpperCase(),
                value: value,
                category: 'operational',
                isConfirmed: false
              });
            } else if (typeof value === 'object' && value.base) {
              costesFromModel.push({
                id: key,
                label: key.replace('_', ' ').toUpperCase(),
                value: value.base,
                category: 'operational',
                isConfirmed: false
              });
            }
          });
        }
        
        if (costesFromModel.length > 0) {
          setFixedCosts(costesFromModel);
        }
      }
    }

    // Cargar plan existente si se está editando
    if (id) {
      const loadPlan = async () => {
        try {
          const res = await axios.get(`/api/plan/${id}`);
          const plan = res.data;
          
          setPlanName(plan.name);
          setPlanDescription(plan.description || '');
          setFinancialData(plan.financial_data || financialData);
          setFixedCosts(plan.fixed_costs || fixedCosts);
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading plan:', err);
          setError('Error al cargar el plan');
          setLoading(false);
        }
      };

      loadPlan();
    }
  }, [id]);

  // Professional data change handlers
  const handleCustomerDataChange = (data) => {
    setCustomerData(data);
  };
  
  const handleRevenueDataChange = (data) => {
    setRevenueData(data);
  };
  
  const handleCostsDataChange = (data) => {
    setCostsData(data);
  };
  
  const handleKPIDataChange = (data) => {
    setKpiData(data);
  };
  
  // Recalculate when data changes
  useEffect(() => {
    if (customerData && revenueData && costsData) {
      calculateProfessionalFinancials();
    } else {
      calculateFinancials();
    }
  }, [financialData, fixedCosts, customerData, revenueData, costsData]);

  // Render section based on active tab
  const renderActiveSection = () => {
    const commonProps = {
      financialData,
      setFinancialData,
      fixedCosts,
      setFixedCosts,
      calculatedResults,
      formatCurrency,
      formatPercentage
    };
    
    const professionalProps = {
      businessModel: selectedBusinessModel,
      customerData,
      revenueData,
      costsData,
      kpiData,
      professionalResults,
      onCustomerDataChange: handleCustomerDataChange,
      onRevenueDataChange: handleRevenueDataChange,
      onCostsDataChange: handleCostsDataChange,
      onKPIDataChange: handleKPIDataChange
    };

    switch (activeSection) {
      case 'resumen':
        return <ResumenExecutivo {...commonProps} professionalResults={professionalResults} />;
      case 'supuestos':
        return <SupuestosGenerales {...commonProps} />;
      case 'proyecciones':
        return <Proyecciones {...commonProps} professionalResults={professionalResults} />;
      case 'sensibilidad':
        return <AnalisisSensibilidad {...commonProps} />;
      case 'garantias':
        return <Garantias {...commonProps} />;
      case 'ratios':
        return <RatiosFinancieros {...commonProps} professionalResults={professionalResults} />;
      case 'clientes':
        return (
          <CustomerManagementSystem
            businessModel={selectedBusinessModel}
            onCustomerDataChange={handleCustomerDataChange}
            initialData={customerData}
          />
        );
      case 'ingresos':
        return (
          <MultipleRevenueStreams
            businessModel={selectedBusinessModel}
            customerData={customerData}
            onRevenueDataChange={handleRevenueDataChange}
            initialData={revenueData}
          />
        );
      case 'gastos':
        return (
          <OperationalCosts
            businessModel={selectedBusinessModel}
            customerData={customerData}
            onCostsDataChange={handleCostsDataChange}
            initialData={costsData}
          />
        );
      case 'kpis':
        return (
          <OperationalKPIs
            businessModel={selectedBusinessModel}
            customerData={customerData}
            revenueData={revenueData}
            onKPIDataChange={handleKPIDataChange}
            initialData={kpiData}
          />
        );
      case 'proyecciones-detalladas':
        return (
          <DetailedMonthlyProjections
            businessModel={selectedBusinessModel}
            professionalResults={professionalResults}
            timeFrame={36}
          />
        );
      default:
        return <ResumenExecutivo {...commonProps} professionalResults={professionalResults} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
          <div className="text-gray-600">Cargando plan financiero...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--body-bg, #f8f9fc)', fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', color: 'var(--text-primary, #333)', lineHeight: '1.6' }}>
      <Header />
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        professionalMode={!!selectedBusinessModel && selectedBusinessModel.id !== 'generico'}
      />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <Alert type="danger" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Plan Details Card */}
        <div className="br-card">
          <div className="br-card-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="br-card-title">Detalles del Plan</h2>
                {selectedBusinessModel && (
                  <div className="tx-12 tx-muted mt-1">
                    <span className="tx-medium">{selectedBusinessModel.nombre}</span> • {selectedBusinessModel.sector}
                  {professionalResults && (
                      <span className="ms-2 pd-5 bg-light-success tx-success tx-11 rounded d-inline-flex align-items-center gap-1">
                        <Activity size={12} />
                        Modo Profesional Activo
                      </span>
                  )}
                  </div>
                )}
              </div>
              <button 
                onClick={savePlan} 
                disabled={saving}
                className="br-btn br-btn-primary"
              >
                {saving ? 'Guardando...' : id ? 'Actualizar Plan' : 'Guardar Plan'}
              </button>
            </div>
          </div>
          
          <div className="br-card-body">
              <div className="col-md-6">
                <div className="br-form-group">
                  <label className="br-form-label">
                    Nombre del Plan
                  </label>
                  <input 
                    type="text" 
                    value={planName} 
                    onChange={(e) => setPlanName(e.target.value)}
                    className="br-form-control"
                    placeholder="Ej: Plan Viabilidad Q1 2024"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="br-form-group">
                  <label className="br-form-label">
                    Descripción (opcional)
                  </label>
                  <input 
                    type="text" 
                    value={planDescription} 
                    onChange={(e) => setPlanDescription(e.target.value)}
                    className="br-form-control"
                    placeholder="Breve descripción del plan"
                  />
                </div>
              </div>
            </div>
          
            {/* Professional Mode Info */}
            {selectedBusinessModel && selectedBusinessModel.id !== 'generico' && (
              <div className="bg-light-primary pd-15 rounded mg-t-15">
                <h4 className="tx-13 tx-medium tx-primary mg-b-10 d-flex align-items-center gap-2">
                  <Activity size={16} />
                  Modo Profesional Activado
                </h4>
                <p className="tx-12 tx-primary mg-b-5">
                  Este plan utiliza gestión operacional avanzada con datos reales del sector <strong>{selectedBusinessModel.sector}</strong>.
                  Configure los datos de <strong>Clientes</strong> e <strong>Ingresos</strong> para obtener proyecciones precisas.
                </p>
                {(!customerData || !revenueData || !costsData) && (
                  <div className="tx-11 tx-warning">
                    ⚠️ Configure las pestañas "Gestión Clientes", "Fuentes Ingresos" y "Gastos Operacionales" para activar el cálculo profesional completo
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Section Content */}
        <div className="br-card">
          <div className="br-card-body">
            {renderActiveSection()}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="br-card mg-t-20">
          <div className="br-card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="br-btn br-btn-outline d-flex align-items-center gap-2"
                >
                  <FileText size={16} />
                  Exportar PDF
                </button>
                <button 
                  onClick={() => alert('Función Excel en desarrollo')}
                  className="br-btn br-btn-outline d-flex align-items-center gap-2"
                >
                  <BarChart size={16} />
                  Exportar Excel
                </button>
              </div>
              <div className="text-end tx-12 tx-muted">
                <div>Documento preparado para Comité de Riesgos</div>
                <div>{user?.company_name} - {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProfessionalCalculator;